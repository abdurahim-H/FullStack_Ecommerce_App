# FullStack_Ecommerce_App
A FullStack Ecommerce App built with Django and React. 
<p id ="top" align="center">
  <img src="https://github.com/YashMarmat/Pages-App-django/blob/master/templates/ecommerce%20%20products%20list%20page.png?raw=true" width="100%">
</p>

Checkout the site in action here <a href="https://condescending-goldstine-79a4ed.netlify.app/">Deployed App</a> (short note below)

(Note: The website can take upto 30 seconds (hosted on Heroku free tier services), as the project has no clients, its just for learning, please refer the source
code to run locally).

# Table of contents
- [About_this_App](#About_this_App)
- [App_Overview](#App_Overview)
  * [Products_List_Page](#Products_List_Page)
  * [Product_Details_Page](#Product_Details_Page)
  * [Product_Edit_Page](#Product_Edit_Page)
  * [Add_Product_Page](#Add_Product_Page)
  * [Checkout_Page](#Checkout_Page)
  * [Payment_Confirmation_Page](#Payment_Confirmation_Page)
  * [Payment_successfull_Page](#Payment_successfull_Page)
  * [Orders_Page_For_User](#Orders_Page_For_User)
  * [Orders_Page_For_Admin](#Orders_Page_For_Admin)
  * [Address_Settings_Page](#Address_Settings_Page)
  * [Address_Create_Page](#Address_Create_Page)
  * [Address_Edit_Page](#Address_Edit_Page)
  * [Card_Settings_Page](#Card_Settings_Page)
  * [Card_Update_Page](#Card_Update_Page)
  * [Login_Page](#Login_Page)
  ## Installation & development (quick start)
  The project has a Django backend and a React frontend. The steps below use a single, consistent venv at the repository root (`.venv`). Follow them from the repository root.

  Prerequisites
  - Python 3.8+ and a virtual environment
  - Node.js LTS (recommended 18.x or 20.x) and npm

  Quick start (from repository root)

  1) Create and activate a Python virtual environment and install backend dependencies

  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r backend/requirements.txt
  ```

  2) Run migrations and start the backend (developer mode)

  ```bash
  export USE_STRIPE_MOCK=1   # use local Stripe mock for development
  # optionally set Stripe keys if you want to test real Stripe:
  # export STRIPE_TEST_PUBLISHABLE_KEY=pk_test_...
  # export STRIPE_TEST_SECRET_KEY=sk_test_...

  cd backend
  python manage.py migrate --noinput
  python manage.py runserver 127.0.0.1:8000
  ```

  3) Start the frontend (new terminal)

  ```bash
  cd frontend
  # Prefer reproducible installs for CI/devs:
  npm ci

  # If `npm ci` fails because package.json and package-lock.json are out of sync,
  # run `npm install` to update the lockfile, then commit the updated
  # `frontend/package-lock.json` so others can use `npm ci`:
  # npm install

  # If you see OpenSSL errors on newer Node versions, add this before start:
  export NODE_OPTIONS=--openssl-legacy-provider
  npm start
  ```

  Quick verification

  ```bash
  # API should return JSON
  curl -sS http://127.0.0.1:8000/api/products/ | python -m json.tool

  # frontend -> http://localhost:3000
  ```

  Troubleshooting (short)

  - package-lock mismatch: If `npm ci` errors with "lock file ... does not satisfy", run `npm install` to regenerate `package-lock.json`, then commit the lockfile to the repo.
  - Node version: prefer Node LTS (18.x or 20.x). Newer Node releases may require `NODE_OPTIONS=--openssl-legacy-provider` for older dependencies.
  - Port conflicts: backend default 8000, frontend default 3000. Find and stop blockers with:

  ```bash
  ss -ltnp | grep ':3000\|:8000'
  # then kill <pid>
  ```
  - Stripe: set `STRIPE_TEST_*` env vars or use `USE_STRIPE_MOCK=1` to avoid calling real Stripe in local dev.
  - stripe import errors: if Django errors reference `stripe.six.moves`, install compatible stripe & six versions in the venv (example: `stripe==12.4.0` and `six==1.17.0`) and reinstall.

  Notes on reproducibility
  - If you choose to run `npm install` locally to fix a lockfile mismatch, commit the updated `frontend/package-lock.json` so collaborators can use `npm ci` for clean, reproducible installs.

  Contribution & forks
  - Work from your fork; add it as a remote and push branches there:

  ```bash
  git remote add myfork https://github.com/<your-username>/FullStack_Ecommerce_App.git
  git push myfork main
  ```

  If you plan to open a PR against upstream, create a feature branch and push it to your fork.
  <img src="https://github.com/YashMarmat/Pages-App-django/blob/master/templates/ecommerce%20%20address%20create%20page.png?raw=true" width="50%">
</p>

### Address_Edit_Page
Here, the user can edit their address.
<p align="center">
  <img src="https://github.com/YashMarmat/Pages-App-django/blob/master/templates/ecommerce%20%20address%20update%20page.png?raw=true" width="50%">
</p>

### Card_Settings_Page
Here, the user can view all their card details. The Page also provides updation and deletion of Card.
<p align="center">
  <img src="https://github.com/YashMarmat/Pages-App-django/blob/master/templates/ecommerce%20%20card%20settings%20page.png?raw=true" width="100%">
</p>


### Card_Update_Page
Here, the user can update their card.
<p align="center">
  <img src="https://github.com/YashMarmat/Pages-App-django/blob/master/templates/ecommerce%20%20card%20update%20page.png?raw=true" width="50%">
</p>

### Login_Page
Requires an Account on the Website
<p align="center">
  <img src="https://github.com/YashMarmat/Pages-App-django/blob/master/templates/ecommerce%20%20sign%20in%20page.png?raw=true" width="100%">
</p>

### Register_Page
<p align="center">
  <img src="https://github.com/YashMarmat/Pages-App-django/blob/master/templates/ecommerce%20%20sign%20up%20page.png?raw=true" width="100%">
</p>

### User_Account_Page
Here, the user can see their details like their Name, Email and Admin Priviledges.
<p align="center">
  <img src="https://github.com/YashMarmat/Pages-App-django/blob/master/templates/ecommerce%20%20user%20account%20page.png?raw=true" width="100%">
</p>

### Update_User_Account_Page
Here, the user can update their account details like username, email and can also reset their password.
<p align="center">
  <img src="https://github.com/YashMarmat/Pages-App-django/blob/master/templates/ecommerce%20account%20update%20page.png?raw=true" width="100%">
</p>

### Delete_User_Account_Page
Here, the user can Delete their account (requires password confirmation)
<p align="center">
  <img src="https://github.com/YashMarmat/Pages-App-django/blob/master/templates/ecommerce%20%20delete%20account%20page.png?raw=true" width="100%">
</p>

### Other_Functionalities
- Used JSON web tokens to achieve the authentication checks in the website.
- Strict Security Checking behind the scenes during the Card Creation and Payment Process.
- JSON Token gets checked for every single request made on the website (except products list and product details page)

## Installation
after downloading/cloning the repository code follow below steps:
* (NOTE: your need to mention your own stripe secret api key and publishable key in django to run the project)

### Backend
* (for both linux and windows)
1) Move in backend folder through terminal and run following commands,

`python3 -m venv env` (for windows --> `python -m venv env`) 

`source env/bin/activate` (for windows --> `env\scripts\activate`)

`pip install -r requirements.txt` (same for both)

`python manage.py runserver` (same for both)

### Frontend
* (for both linux and windows)
2) Move in frontend folder through terminal and run follwing commands

`npm i`

`npm start`

## All set ! Happy coding :)

<p><a href="#top">Back to Top</a></p>

## Development
This project uses a Django backend and React frontend. The following steps get a developer environment running.

Prerequisites
- Python 3.8+ and a virtual environment
- Node.js (LTS recommended) and npm

Quick start (from repository root)

1) Create and activate a Python virtual environment and install backend deps:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

2) Run migrations and start the backend (developer mode):

```bash
export USE_STRIPE_MOCK=1  # use local Stripe mock for development
cd backend
python manage.py migrate --noinput
python manage.py runserver 127.0.0.1:8000
```

3) Start the frontend (new terminal):

```bash
cd frontend
npm ci
# If you encounter OpenSSL errors on newer Node versions:
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```

Optional: create a test user and sample product (from `backend`):

```bash
python manage.py shell -c "from django.contrib.auth import get_user_model; User=get_user_model(); u,created=User.objects.get_or_create(username='ui_test_user', defaults={'email':'ui_test@example.com'}); u.set_password('testpass123'); u.save(); print('created' if created else 'exists',u.username)"

python manage.py shell -c "from product.models import Product; Product.objects.get_or_create(name='Test Laptop', defaults={'description':'Sample','price':'1299.99','stock':True})"
```

Notes & troubleshooting
- Run with `USE_STRIPE_MOCK=1` locally to avoid real Stripe calls and common package/version issues.
- If Django fails importing `stripe` with errors referencing `stripe.six.moves`, pin a compatible version and install `six` in the venv (example: `stripe==12.4.0` and `six==1.17.0`) and reinstall dependencies.
- To verify the frontend is running: `ss -ltnp | grep ':3000' || true`.
- To query products API: `curl -sS http://127.0.0.1:8000/api/products/ | python -m json.tool`.

Contribution & forks
- Work from your fork; add it as a remote and push branches there:

```bash
git remote add myfork https://github.com/<your-username>/FullStack_Ecommerce_App.git
git push myfork main
```

If you plan to open a PR against upstream, create a feature/topic branch and push it to your fork.


