FROM python:3.11-slim

WORKDIR /app

RUN if [ -f /etc/apt/sources.list ]; then \
        sed -i \
            -e 's|http://deb.debian.org/debian|https://deb.debian.org/debian|g' \
            -e 's|http://security.debian.org/debian-security|https://security.debian.org/debian-security|g' \
            /etc/apt/sources.list; \
    elif [ -f /etc/apt/sources.list.d/debian.sources ]; then \
        sed -i \
            -e 's|http://deb.debian.org/debian|https://deb.debian.org/debian|g' \
            -e 's|http://security.debian.org/debian-security|https://security.debian.org/debian-security|g' \
            /etc/apt/sources.list.d/debian.sources; \
    fi \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
