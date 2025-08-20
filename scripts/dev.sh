#!/usr/bin/env bash
set -euo pipefail
# Simple dev wrapper: ensures virtualenv, runs migrations, starts backend, waits for it,
# then starts frontend with NODE_OPTIONS to avoid OpenSSL issues.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p tmp

if [ -f .venv/bin/activate ]; then
  # activate existing venv
  # shellcheck disable=SC1091
  . .venv/bin/activate
else
  echo ".venv not found — creating and installing backend requirements (this may take a minute)"
  python3 -m venv .venv
  # shellcheck disable=SC1091
  . .venv/bin/activate
  python -m pip install --upgrade pip
  python -m pip install -r backend/requirements.txt
fi

echo "Running Django migrations..."
cd backend
export USE_STRIPE_MOCK=1
python manage.py migrate --noinput || true

echo "Starting Django dev server (127.0.0.1:8000)"
python manage.py runserver 127.0.0.1:8000 > ../tmp/backend.log 2>&1 &
BACK_PID=$!
echo "backend PID=$BACK_PID"

echo "Waiting for backend to listen on 127.0.0.1:8000..."
for i in $(seq 1 30); do
  if ss -ltn | grep -q ':8000'; then
    echo "backend is listening"
    break
  fi
  sleep 1
done

cd ../frontend
echo "Starting React dev server (auto-selecting PORT starting at 3000) with legacy OpenSSL flag"
# find first free port starting at 3000
START_PORT=3000
PORT=$START_PORT
while ss -ltn | awk '{print $4}' | grep -Eq "[:.]$PORT$"; do
  PORT=$((PORT+1))
done
export NODE_OPTIONS=--openssl-legacy-provider
export PORT
echo "Chosen frontend PORT=$PORT"
PORT=$PORT npm start > ../tmp/frontend.log 2>&1 &
FRONT_PID=$!
echo "frontend PID=$FRONT_PID"

echo "Logs: $ROOT/tmp/backend.log and $ROOT/tmp/frontend.log"
echo "To stop: kill $BACK_PID $FRONT_PID"

wait
