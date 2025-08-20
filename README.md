# FullStack_Ecommerce_App — Local development

This project is a Django + React full-stack example. The repository contains a working Django backend (SQLite) and a Create-React-App frontend that proxies API requests to the backend in development.

This README explains a short, repeatable local setup that was validated on Linux during development.

Quick start (validated)

1. Create & activate a Python virtual environment

```bash
cd FullStack_Ecommerce_App
python3 -m venv .venv
. .venv/bin/activate
```

2. Install backend dependencies

```bash
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt
```

3. Start both backend and frontend (recommended)

We provide a wrapper script to start the backend then the frontend in the right order and with the Node OpenSSL compatibility flag for older react-scripts.

```bash
./scripts/dev.sh
```

The script will:
- create/activate `.venv` (if missing) and install backend requirements
- run Django migrations
- start the Django development server on `127.0.0.1:8000`
- start the React dev server on the first free port starting at `3000` (to avoid interactive prompts)

Logs are written to `FullStack_Ecommerce_App/tmp/backend.log` and `FullStack_Ecommerce_App/tmp/frontend.log`.

# FullStack_Ecommerce_App

This repository contains a full-stack e-commerce example: a Django backend (REST API) and a React frontend (Create React App). The project is intended for local development, learning and demos. This README centralizes setup, development and troubleshooting instructions for your teammates.

## Quick summary
- Backend: Django + Django REST Framework (API under `/api/`)
- Frontend: React (CRA) in `frontend/`, talking to backend via proxy during local dev
- DB: SQLite (default for development)
- Payments: supports a local Stripe mock for offline development (`USE_STRIPE_MOCK=1`)
- Seed images are stored at `backend/static/images/`; a management command is included to create Product rows that reference those images.

## Table of contents
- Prerequisites
- Repository layout
- One-line quick start
- Backend: setup, run, seed
- Frontend: setup and run
- Testing & linting
- Troubleshooting & common issues
- Contributing

---

## Prerequisites
- Python 3.8+ (3.10/3.11 recommended)
- Node.js LTS (18.x or 20.x recommended) and npm
- Git

Optional (for real Stripe tests): Stripe test keys. For local development you can use the included Stripe mock.

## Repository layout (top-level of this project)
- `backend/` — Django app and API (models, views, settings)
- `frontend/` — React Create-React-App source
- `backend/static/images/` — sample product images (served in dev at `/images/<file>`)

## One-line quick start (ideal for experienced devs)

1) Backend: create venv, install, run migrations, seed images, run server

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cd backend
export USE_STRIPE_MOCK=1
python manage.py migrate --noinput
python manage.py seed_products     # creates Product rows that point to files in static/images
python manage.py runserver 127.0.0.1:8000
```

2) Frontend: in another terminal

```bash
cd frontend
# prefer npm ci for reproducible installs
npm ci || npm install
export NODE_OPTIONS=--openssl-legacy-provider  # only if you see OpenSSL errors on newer Node versions
npm start
```

Open the app at http://localhost:3000 (CRA may prompt to use a different port if 3000 is busy).

## Backend — full setup and notes

1. Create and activate a venv at repo root (recommended):

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install Python dependencies:

```bash
pip install -r backend/requirements.txt
```

3. Environment variables (dev):
- Use the local Stripe mock in dev to avoid real Stripe network calls:
	- `export USE_STRIPE_MOCK=1`
- If you want to test with real Stripe keys set `STRIPE_TEST_PUBLISHABLE_KEY` and `STRIPE_TEST_SECRET_KEY`.

4. Database migrations and seeding (from `backend`):

```bash
python manage.py migrate --noinput
python manage.py seed_products
```

The `seed_products` management command reads image filenames from `backend/static/images/` and creates Product rows that reference those images. It is safe to re-run; it uses `get_or_create` by name.

5. Run the dev server:

```bash
python manage.py runserver 127.0.0.1:8000
```

Media/static
- During development Django serves media at `/images/<filename>` because `MEDIA_URL` is set to `/images/` and `MEDIA_ROOT` is `static/images`.

## Frontend — full setup and notes

1. Install and run (from `frontend`):

```bash
cd frontend
npm ci || npm install
export NODE_OPTIONS=--openssl-legacy-provider  # only if necessary
npm start
```

2. Proxy / API
- The CRA frontend uses a proxy setting (in `frontend/package.json`) to forward API calls to the backend at `http://127.0.0.1:8000` in development.

3. If CRA selects a different port (e.g. 3001) open that port in your browser.

## Running tests
- Backend Django tests: from `backend` run `python manage.py test`.
- Frontend tests: use the usual CRA commands in `frontend` (if present in package.json).

## Troubleshooting & common issues

- DisallowedHost when running API tests locally: set the test client's `HTTP_HOST` to `127.0.0.1:8000`, or add that host to `ALLOWED_HOSTS` in `backend/my_project/settings.py` for local dev.
- curl JSON quoting issues: use `python manage.py shell` and DRF APIClient for complex test flows, or wrap payloads in single quotes carefully.
- Stripe import errors referencing `stripe.six.moves`: pin stripe and six to compatible versions and reinstall (example: `stripe==12.4.0`, `six==1.17.0`) — this only affects certain stripe versions and older code.
- Node/OpenSSL errors: on some Node versions run with `NODE_OPTIONS=--openssl-legacy-provider` when starting CRA.
- Port conflicts: backend default 8000, frontend default 3000. Find blockers and kill them: `ss -ltnp | grep ':3000\|:8000'`.

If media images don't load in dev, confirm `python manage.py seed_products` was run and that the backend is running and serving `/images/<file>` (try opening `http://127.0.0.1:8000/images/laptop.jpg`).

## Clean-up notes (what I removed / kept)
- I kept documentation centralized in this `README.md` and retained the `README.LOCAL.md`/other README files if present — consider removing duplicates if you want stricter consolidation. This commit centralizes the important setup info and adds the `seed_products` management command to reproduce the sample product data and images.

## Contributing and support
- Work from your fork and create feature branches for PRs.

Example:

```bash
git checkout -b feat/your-feature
git push origin feat/your-feature
```

If you need help reproducing the development environment on a teammate's machine, send me the OS and Python/Node versions and I will provide a short checklist specific to that environment.

---

Back to Top
