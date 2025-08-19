This file lists recommended cleanup steps to prepare the repository for committing/pushing and to make it safe for other developers.

1. Files automatically ignored via .gitignore:
   - Python virtual environments (`.venv/`, `venv/`)
   - Local SQLite database `db.sqlite3`
   - Node `node_modules/` and build artifacts
   - IDE/editor directories (.vscode, .idea)

2. Recommended cleanup commands (run from repo root):

```bash
# Remove local sqlite DB from git and disk (if you don't need it)
git rm --cached backend/db.sqlite3 || true
rm -f backend/db.sqlite3 || true

# Remove node_modules from git tracking (if tracked) and local
git rm -r --cached frontend/node_modules || true
rm -rf frontend/node_modules || true

# Ensure .gitignore is in place
git add .gitignore CLEANUP.md

# Create a cleanup branch and commit
git checkout -b feature/cleanup
git commit -m "chore: add .gitignore and cleanup instructions"

# Push the branch
git push -u origin feature/cleanup
```

3. Notes:
 - Do NOT commit `.env` or secrets. Add them to `.gitignore` if present.
 - If backend/db.sqlite3 contains important dev data you need to keep, skip removing it and instead export any needed fixtures.

If you want, I can: apply these removals and create the `feature/cleanup` branch for you now.
