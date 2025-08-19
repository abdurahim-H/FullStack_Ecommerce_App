Developer runbook — FullStack_Ecommerce_App
=========================================

Purpose
-------
This document provides a concise, reproducible set of steps to get the project running for development and testing. It is targeted at developers who already have a working Git checkout of the repository.

Prerequisites
-------------
- Linux / macOS (Windows is supported but command examples use Bash)
- Python 3.8+ (use a virtual environment)
- Node.js (recommended LTS) and npm
- Git access to the repository (your fork is the recommended remote for pushing changes)

Repository layout (important paths)
----------------------------------
- backend/         — Django project
- frontend/        — React app
- backend/requirements.txt — Python dependencies

Quick start (recommended)
-------------------------
1. Create and activate a Python virtual environment (from repo root):

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

2. Apply backend migrations and start the Django server (use the local Stripe mock for development):

```bash
export USE_STRIPE_MOCK=1        # makes payments use backend/payments/stripe_mock.py
cd backend
python manage.py migrate --noinput
python manage.py runserver 127.0.0.1:8000
```

3. Start the frontend dev server (new terminal):

```bash
cd frontend
npm ci                        # reproducible install
export NODE_OPTIONS=--openssl-legacy-provider  # only if you encounter OpenSSL errors on recent Node
npm start
```

Create a test user and sample product (optional)
-----------------------------------------------
Run these from the `backend` folder:

```bash
python manage.py shell -c "from django.contrib.auth import get_user_model; User=get_user_model(); u,created=User.objects.get_or_create(username='ui_test_user', defaults={'email':'ui_test@example.com'}); u.set_password('testpass123'); u.save(); print('created' if created else 'exists',u.username)"

python manage.py shell -c "from product.models import Product; Product.objects.get_or_create(name='Test Laptop', defaults={'description':'Sample','price':'1299.99','stock':True})"
```

Environment variables and secrets
--------------------------------
- Do not commit secrets. Use environment variables for keys, e.g.:
  - STRIPE_SECRET_KEY
  - DJANGO_SECRET_KEY

Troubleshooting
---------------
- Stripe import error on startup: if Django fails importing `stripe` (ModuleNotFoundError referencing `stripe.six.moves`) either:
  - Run with `USE_STRIPE_MOCK=1` (recommended for local dev), or
  - Pin a compatible stripe version and install `six` in the venv (e.g. `stripe==12.4.0` and `six==1.17.0`) and reinstall dependencies.
- Frontend OpenSSL errors with newer Node: set `NODE_OPTIONS=--openssl-legacy-provider` before `npm start`.

Quick checks
------------
- Verify frontend is listening on :3000:
  - `ss -ltnp | grep ':3000' || true`
- Confirm backend API returns products:
  - `curl -sS http://127.0.0.1:8000/api/products/ | python -m json.tool`

Git and collaboration notes
---------------------------
- This repository should be worked from your fork. Example to add your fork and push a branch:

```bash
git remote add myfork https://github.com/<your-username>/FullStack_Ecommerce_App.git
git push myfork main
```

If you plan to open a pull request against the upstream repository, create a topic branch and push it to your fork.

Contact / support
-----------------
If your teammates need help getting set up, share this doc and the fork URL. For environment-specific problems (Stripe errors, Python version mismatches) share the error text and I will help reproduce and fix.

-- end of runbook
