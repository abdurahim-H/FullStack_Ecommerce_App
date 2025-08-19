DEV_RUN.md
============

Quick developer runbook for the project (local dev, Linux).

Prerequisites
- Python 3.8+ virtual environment (the repo was tested with the workspace venv at ../.venv)
- Node.js (the project was tested with Node >= 16; newer Node may need an OpenSSL workaround)
- npm

1) Backend: create & use virtualenv, install deps, run migrations

- Activate your venv (example used in this workspace):
```bash
source /home/abdurahim/Desktop/Andrew_samples/.venv/bin/activate
```

- Install Python deps (only if you changed requirements):
```bash
pip install -r backend/requirements.txt
```

- Apply migrations (required once after cloning or when migrations change):
```bash
cd backend
python manage.py migrate --noinput
```

2) Backend: start the Django dev server (use Stripe mock for local dev)

- The repo includes a dev-only Stripe mock. Start the backend with the mock enabled:
```bash
export USE_STRIPE_MOCK=1
cd /home/abdurahim/Desktop/Andrew_samples/FullStack_Ecommerce_App/backend
python manage.py runserver 127.0.0.1:8000
```

Notes:
- When `USE_STRIPE_MOCK=1` the backend uses `backend/payments/stripe_mock.py` instead of contacting Stripe.
- Backend APIs are available under /api/ (for example: http://127.0.0.1:8000/api/products/)

3) Frontend: install deps and start dev server

- From the repo root:
```bash
cd /home/abdurahim/Desktop/Andrew_samples/FullStack_Ecommerce_App/frontend
npm install --no-audit --no-fund
```

- If you see OpenSSL errors (ERR_OSSL_EVP_UNSUPPORTED) with newer Node.js, start the dev server with this environment variable:
```bash
export NODE_OPTIONS=--openssl-legacy-provider
nohup npm start > /tmp/frontend.log 2>&1 &
```

- After a successful start you should see:
  Local: http://localhost:3000
  On Your Network: http://<your-ip>:3000

4) Create a test user and sample product (optional, handy for manual tests)

- Create a test user:
```bash
cd /home/abdurahim/Desktop/Andrew_samples/FullStack_Ecommerce_App/backend
python manage.py shell -c "from django.contrib.auth import get_user_model; User=get_user_model(); u,created=User.objects.get_or_create(username='ui_test_user', defaults={'email':'ui_test@example.com'}); u.set_password('testpass123'); u.save(); print('created' if created else 'exists',u.username)"
```

- Create a sample product (if you need one):
```bash
python manage.py shell -c "from product.models import Product; Product.objects.get_or_create(name='Test Laptop', defaults={'description':'Sample','price':'1299.99','stock':True})"
```

5) Useful checks and troubleshooting

- Confirm the frontend is listening on port 3000:
```bash
ss -ltnp | grep ':3000' || true
tail -n 200 /tmp/frontend.log
```

- Confirm API returns products:
```bash
curl -sS http://127.0.0.1:8000/api/products/ | python -m json.tool
```

- If http://127.0.0.1:8000/ shows a Django 404: that's expected — use the frontend at :3000 for the SPA and /api/ for backend endpoints.

- If Stripe import errors occur under Python 3.12, ensure `USE_STRIPE_MOCK=1` for local runs or pin the `stripe`/`six` versions in `backend/requirements.txt`.

6) Stopping servers

- Stop backend: Ctrl+C in the terminal running manage.py, or kill the python PID.
- Stop frontend: kill the `node` process shown by `ps -ef | grep react-scripts` or `pkill -f "react-scripts"`.

7) Git / branch notes

- Cleanup branch used locally: `feature/cleanup` (commits with cleanup and stripe mock). The branch is local and was not pushed to the original upstream by default.
- To push to your fork (example):
```bash
git remote add myfork git@github.com:<your-username>/FullStack_Ecommerce_App.git
git push myfork feature/cleanup
```

8) Quick checklist (one-liner commands)

```bash
# backend
source /home/abdurahim/Desktop/Andrew_samples/.venv/bin/activate
cd backend && pip install -r requirements.txt && python manage.py migrate --noinput
export USE_STRIPE_MOCK=1; python manage.py runserver 127.0.0.1:8000

# frontend
cd ../frontend; npm install; export NODE_OPTIONS=--openssl-legacy-provider; nohup npm start > /tmp/frontend.log 2>&1 &
```

If anything above fails for you, paste the failing command output and I will fix the instructions or the project files.

-- end of DEV_RUN.md
