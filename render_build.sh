#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

# Ensure we are at repository root
if [ -d "../ai-mock-interview" ]; then
    cd ..
fi

# Ensure Clerk publishable key is available at build time
export VITE_CLERK_PUBLISHABLE_KEY="${VITE_CLERK_PUBLISHABLE_KEY:-${CLERK_PUBLISHABLE_KEY:-pk_test_c2V0dGxpbmctdGV0cmEtNzk1My5jbGVyay5hY2NvdW50cy5kZXYk}}"

echo "=========================================="
echo "==> 1/4: Building React Frontend..."
echo "=========================================="
cd ai-mock-interview
npm install
npm run build
cd ..

echo "=========================================="
echo "==> 2/4: Installing Python Dependencies..."
echo "=========================================="
cd backend
pip install -r requirements.txt

echo "=========================================="
echo "==> 3/4: Running Database Migrations..."
echo "=========================================="
python manage.py migrate

echo "=========================================="
echo "==> 4/4: Collecting Static Files..."
echo "=========================================="
python manage.py collectstatic --no-input

echo "=========================================="
echo "==> Single-URL Build Complete!"
echo "=========================================="
