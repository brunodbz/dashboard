ARG PYTHON_IMAGE=python:3.11-slim
FROM ${PYTHON_IMAGE}

WORKDIR /app

RUN if [ -f /etc/apt/sources.list ]; then \
        sed -i \
            -e 's|https://deb.debian.org/debian|http://deb.debian.org/debian|g' \
            -e 's|https://security.debian.org/debian-security|http://security.debian.org/debian-security|g' \
            /etc/apt/sources.list; \
    elif [ -f /etc/apt/sources.list.d/debian.sources ]; then \
        sed -i \
            -e 's|https://deb.debian.org/debian|http://deb.debian.org/debian|g' \
            -e 's|https://security.debian.org/debian-security|http://security.debian.org/debian-security|g' \
            /etc/apt/sources.list.d/debian.sources; \
    fi \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Increase pip timeout and retries to handle slow connections during image builds.
# Using environment variables keeps the settings consistent across any future pip commands.
ENV PIP_DEFAULT_TIMEOUT=1200 \
    PIP_RETRIES=25 \
    PIP_DISABLE_PIP_VERSION_CHECK=1
RUN pip install --no-cache-dir --default-timeout=${PIP_DEFAULT_TIMEOUT} --retries ${PIP_RETRIES} --progress-bar off -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
