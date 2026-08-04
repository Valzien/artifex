#!/bin/sh
set -e

export PORT="${PORT:-8080}"

if [ -f .env ]; then
    export $(grep -v '^#' .env | grep -v '^$' | xargs)
fi

for i in 1 2 3 4 5; do
    echo "Running migrations (attempt $i)..."
    if php artisan migrate --force; then
        break
    fi
    echo "Migration failed, retrying in 5s..."
    sleep 5
done

php artisan storage:link >/dev/null 2>&1 || true
php artisan config:cache >/dev/null 2>&1 || true
php artisan route:cache >/dev/null 2>&1 || true
php artisan view:cache >/dev/null 2>&1 || true

envsubst '${PORT}' < /etc/nginx/http.d/default.conf > /tmp/nginx.conf
cp /tmp/nginx.conf /etc/nginx/http.d/default.conf

exec supervisord -c /etc/supervisord.conf
