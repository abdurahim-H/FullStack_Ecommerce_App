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
