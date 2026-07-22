# TrendWeaver Engine - Agent Backend

AI-powered backend service for real-time SEO trend detection and metadata generation.

## Setup

```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `GET /` - Health check
- `GET /health` - Service health status
- `POST /api/analyze-trend` - Analyze topic trends and generate SEO metadata
- `POST /api/generate-metadata` - Generate SEO metadata for a topic

## Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
