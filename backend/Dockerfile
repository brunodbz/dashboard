ARG PYTHON_IMAGE=python:3.11-slim
FROM ${PYTHON_IMAGE}

WORKDIR /app

RUN if [ -f /etc/apt/sources.list ]; then \
        sed -i \
            -e 's|http://deb.debian.org|https://deb.debian.org|g' \
            -e 's|http://security.debian.org|https://security.debian.org|g' \
            /etc/apt/sources.list; \
    fi \
    && if [ -f /etc/apt/sources.list.d/debian.sources ]; then \
        sed -i \
            -e 's|http://deb.debian.org/debian|https://deb.debian.org/debian|g' \
            -e 's|http://security.debian.org/debian-security|https://security.debian.org/debian-security|g' \
            /etc/apt/sources.list.d/debian.sources; \
    fi \
    && printf 'Acquire::Retries "5";\nAcquire::http::Timeout "30";\nAcquire::https::Timeout "30";\n' > /etc/apt/apt.conf.d/80-retries \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        cargo \
        libffi-dev \
        libssl-dev \
        libpq-dev \
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
