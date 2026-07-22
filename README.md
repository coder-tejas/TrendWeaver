# TrendWeaver Engine

A full-stack AI agent system for real-time SEO trend detection and server-side SEO injection. Built to demonstrate Full Stack & AI Agent capabilities.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    TrendWeaver Engine                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐         ┌──────────────────────────┐ │
│  │    Frontend      │         │     Agent Backend        │ │
│  │   (Next.js)      │◄───────►│      (FastAPI)           │ │
│  │                   │  API   │                          │ │
│  │  • App Router     │  Calls │  • Trend Detection       │ │
│  │  • TailwindCSS    │         │  • SEO Generation        │ │
│  │  • SSR Ready      │         │  • AI Agent Logic        │ │
│  │                   │         │                          │ │
│  │  Port: 3000      │         │  Port: 8000              │ │
│  └──────────────────┘         └──────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
trendweaver-engine/
├── frontend/                 # Next.js App Router application
│   ├── src/
│   │   └── app/
│   │       ├── layout.tsx    # Root layout (SEO tags placeholder)
│   │       ├── page.tsx      # Main page
│   │       └── globals.css   # TailwindCSS styles
│   ├── package.json
│   └── tailwind.config.ts
│
├── agent-backend/            # Python FastAPI backend
│   ├── main.py               # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── .venv/                # Virtual environment
│
└── README.md                 # This file
```

## How It Works

### 1. Trend Detection
The AI agent backend monitors trending topics and keywords in real-time using:
- Web scraping and API integrations
- Trend analysis algorithms
- Keyword clustering and scoring

### 2. SEO Metadata Generation
Based on detected trends, the agent generates:
- Optimized page titles
- Meta descriptions
- Open Graph tags
- Keyword arrays
- Structured data

### 3. Server-Side Injection
The frontend intentionally leaves SEO meta tags blank. The backend:
- Intercepts page requests
- Generates context-aware SEO metadata
- Injects meta tags before server-side rendering
- Ensures search engines receive optimized content

## Getting Started

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Backend Setup
```bash
cd agent-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
```

## API Endpoints

### Agent Backend (FastAPI)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | Service status |
| POST | `/api/analyze-trend` | Analyze topic trends |
| POST | `/api/generate-metadata` | Generate SEO metadata |

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **Rendering**: Server-Side Rendering (SSR)

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.10+
- **Validation**: Pydantic
- **HTTP Client**: httpx
- **Server**: Uvicorn

## Development Roadmap

- [ ] Implement trend detection algorithms
- [ ] Integrate with trending APIs (Google Trends, Twitter, etc.)
- [ ] Add AI-powered content analysis
- [ ] Implement server-side SEO injection middleware
- [ ] Add caching layer for trend data
- [ ] Create monitoring dashboard
- [ ] Add authentication and rate limiting

## License

MIT License - see LICENSE file for details
