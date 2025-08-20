# Local setup and developer guide

This file contains exact, reproducible instructions for developers who want to run the project locally. It is intended to be the single source of truth for environment setup, migrations, seeding and common troubleshooting steps.

Prerequisites
- Python 3.8+ (3.10/3.11 recommended)
- Node.js LTS (18.x or 20.x recommended) and npm
- Git

Quick start (from repository root)

1) Create and activate a Python virtual environment and install backend dependencies

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

2) Run migrations and seed the sample products and start the backend

```bash
cd backend
export USE_STRIPE_MOCK=1
python manage.py migrate --noinput
python manage.py seed_products
python manage.py runserver 127.0.0.1:8000
```

3) Start the frontend in another terminal

```bash
cd frontend
npm ci || npm install
export NODE_OPTIONS=--openssl-legacy-provider  # only if you see OpenSSL errors
npm start
```

Verification

```bash
curl -sS http://127.0.0.1:8000/api/products/ | python -m json.tool
open http://localhost:3000
```

Notes & troubleshooting
- If you get `DisallowedHost` in tests, set the test client's `HTTP_HOST` or add `127.0.0.1` to `ALLOWED_HOSTS` in `backend/my_project/settings.py` for local dev.
- If Django raises errors importing `stripe` referencing `stripe.six.moves`, pin `stripe==12.4.0` and `six==1.17.0` in your venv and reinstall.
- If CRA fails due to Node OpenSSL changes, use `NODE_OPTIONS=--openssl-legacy-provider` when starting the frontend.
- To confirm static images are served in dev, open e.g. `http://127.0.0.1:8000/images/laptop.jpg` in your browser.

Seed command
- `python manage.py seed_products` will create Product rows for files found in `backend/static/images/`.

If you want richer seed metadata instead of filename-based names, ask me and I will add a curated fixture.
Local quick-start

1) Create venv and install backend deps

```bash
cd FullStack_Ecommerce_App
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r backend/requirements.txt
```

2) Start both backend + frontend (recommended)

```bash
./scripts/dev.sh
```

3) Logs

- backend: tmp/backend.log
- frontend: tmp/frontend.log

4) Test API

```bash
curl -i http://127.0.0.1:8000/api/products/
```

If the frontend uses a different port, check tmp/frontend.log for the chosen port.
