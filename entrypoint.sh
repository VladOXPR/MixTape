#!/bin/sh
set -e

python manage.py migrate --noinput

exec gunicorn mixtape.wsgi:application \
    --bind "0.0.0.0:${PORT:-8080}" \
    --workers 2 \
    --threads 4 \
    --timeout 120
