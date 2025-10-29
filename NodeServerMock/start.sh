#!/bin/bash
# Development startup script for Python API

echo "Starting Job Search API..."
echo "Installing dependencies..."
pip install -r requirements.txt

echo "Starting FastAPI server with auto-reload..."
uvicorn main:app --host 127.0.0.1 --port 8000 --reload

echo "API running at: http://127.0.0.1:8000"
echo "Swagger UI at: http://127.0.0.1:8000/docs"
echo "ReDoc at: http://127.0.0.1:8000/redoc"