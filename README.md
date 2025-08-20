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

Manual alternative

Start backend:

```bash
cd FullStack_Ecommerce_App/backend
. ../.venv/bin/activate
export USE_STRIPE_MOCK=1
python manage.py migrate --noinput
python manage.py runserver 127.0.0.1:8000
```

Start frontend (in a second terminal):

```bash
cd FullStack_Ecommerce_App/frontend
export NODE_OPTIONS=--openssl-legacy-provider
PORT=3000 npm start
```

Test the API and frontend

```bash
curl -i http://127.0.0.1:8000/api/products/
curl -i http://127.0.0.1:3000/api/products/  # replace 3000 with chosen frontend port
```

Provided test account

To make UI testing easy a test user was created during validation:

- username: `ui_test_user`
- password: `testpass123`
- email: `ui_test@example.com`

You can recreate it with:

```bash
cd FullStack_Ecommerce_App/backend
. ../.venv/bin/activate
python manage.py shell -c "from django.contrib.auth import get_user_model; User=get_user_model(); u,created=User.objects.get_or_create(username='ui_test_user', defaults={'email':'ui_test@example.com'}); u.set_password('testpass123'); u.save(); print('created' if created else 'exists',u.username)"
```

Troubleshooting

- If react prompts to use another port, the wrapper automatically picks the next free port. Check `tmp/frontend.log` for the chosen port.
- If you see OpenSSL errors when starting the frontend, make sure `NODE_OPTIONS=--openssl-legacy-provider` is set.
- If migrations fail, check `backend/db.sqlite3` permissions and that your venv has the required packages installed.

If you want me to commit these docs to a branch and open a PR, tell me the commit message and branch name.
