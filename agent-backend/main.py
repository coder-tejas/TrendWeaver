from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from openai import OpenAI
from dotenv import load_dotenv
import json
import os
import random

load_dotenv()

app = FastAPI(
    title="TrendWeaver Engine - AI Agent Backend",
    description="AI agent for real-time SEO trend detection and metadata generation",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI client setup
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# Pydantic Models
class JSONLDSchema(BaseModel):
    context: str = "https://schema.org"
    type: str = "Article"
    headline: str
    description: str
    author: Dict[str, str]
    datePublished: str
    dateModified: str
    publisher: Dict[str, Any]
    mainEntityOfPage: Dict[str, str]

class SEOMetadata(BaseModel):
    title: str = Field(..., description="Optimized SEO title (50-60 chars)")
    description: str = Field(..., description="Optimized meta description (150-160 chars)")
    json_ld: JSONLDSchema = Field(..., description="JSON-LD structured data for Article")
    keywords: List[str] = Field(..., description="Relevant SEO keywords")
    trend_score: float = Field(..., ge=0, le=1, description="Trend relevance score")

class TrendResponse(BaseModel):
    topic: str
    seo_metadata: SEOMetadata
    generated_at: str
    cache_expires_at: str
    is_cached: bool

class HealthResponse(BaseModel):
    status: str
    service: str
    cached_topics: int

class TrackedKeyword(BaseModel):
    keyword: str
    volume: int
    trend: str
    score: float

class DashboardStats(BaseModel):
    current_trending_keyword: str
    win_potential: int
    overall_seo_score: int
    metadata_synced: int
    cached_topics: int
    crawler_visits_today: int
    tracked_keywords: List[TrackedKeyword]
    last_updated: str
    agent_status: str

# Mock trending topics
TRENDING_TOPICS = [
    "AI coding assistants",
    "Serverless infrastructure",
    "Edge computing",
    "LLM fine-tuning",
    "RAG architecture",
    "AI agent frameworks",
    "WebAssembly applications",
    "Kubernetes operators",
    "GraphQL federation",
    "DevSecOps automation"
]

# Cache implementation (mock Redis)
seo_cache: Dict[str, Dict[str, Any]] = {}
CACHE_TTL_SECONDS = 300  # 5 minutes

def is_cache_valid(topic: str) -> bool:
    if topic not in seo_cache:
        return False
    cached_time = seo_cache[topic]["timestamp"]
    return (datetime.now() - cached_time).total_seconds() < CACHE_TTL_SECONDS

def get_from_cache(topic: str) -> Optional[SEOMetadata]:
    if is_cache_valid(topic):
        return seo_cache[topic]["data"]
    return None

def store_in_cache(topic: str, data: SEOMetadata):
    seo_cache[topic] = {
        "data": data,
        "timestamp": datetime.now()
    }

def generate_seo_with_openai(topic: str) -> SEOMetadata:
    prompt = f"""Generate SEO metadata for a trending tech topic: "{topic}"

Return a JSON object with these exact fields:
- title: Optimized SEO title (50-60 characters, include primary keyword)
- description: Meta description (150-160 characters, compelling and keyword-rich)
- keywords: Array of 5-7 relevant SEO keywords
- json_ld: A valid JSON-LD Article schema with headline, description, author (name: "TrendWeaver AI"), datePublished, dateModified, publisher (name: "TrendWeaver", logo URL), mainEntityOfPage
- trend_score: Float between 0 and 1 indicating trend relevance

Return ONLY valid JSON, no markdown formatting."""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are an SEO expert. Return valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )

        content = response.choices[0].message.content
        seo_data = json.loads(content)

        now = datetime.now()
        json_ld = JSONLDSchema(
            headline=seo_data.get("json_ld", {}).get("headline", seo_data["title"]),
            description=seo_data.get("json_ld", {}).get("description", seo_data["description"]),
            author=seo_data.get("json_ld", {}).get("author", {"@type": "Person", "name": "TrendWeaver AI"}),
            datePublished=seo_data.get("json_ld", {}).get("datePublished", now.isoformat()),
            dateModified=seo_data.get("json_ld", {}).get("dateModified", now.isoformat()),
            publisher=seo_data.get("json_ld", {}).get("publisher", {"@type": "Organization", "name": "TrendWeaver"}),
            mainEntityOfPage=seo_data.get("json_ld", {}).get("mainEntityOfPage", {"@type": "WebPage", "@id": f"https://trendweaver.com/topic/{topic.lower().replace(' ', '-')}"})
        )

        return SEOMetadata(
            title=seo_data["title"],
            description=seo_data["description"],
            json_ld=json_ld,
            keywords=seo_data["keywords"],
            trend_score=seo_data.get("trend_score", random.uniform(0.7, 0.95))
        )

    except Exception as e:
        fallback_score = random.uniform(0.7, 0.95)
        now = datetime.now()
        return SEOMetadata(
            title=f"{topic}: Complete Guide & Best Practices | TrendWeaver",
            description=f"Discover everything about {topic}. Expert insights, tutorials, and trends for 2024.",
            json_ld=JSONLDSchema(
                headline=f"{topic}: Complete Guide & Best Practices",
                description=f"Comprehensive guide to {topic} with expert insights and tutorials.",
                author={"@type": "Person", "name": "TrendWeaver AI"},
                datePublished=now.isoformat(),
                dateModified=now.isoformat(),
                publisher={"@type": "Organization", "name": "TrendWeaver", "logo": {"@type": "ImageObject", "url": "https://trendweaver.com/logo.png"}},
                mainEntityOfPage={"@type": "WebPage", "@id": f"https://trendweaver.com/topic/{topic.lower().replace(' ', '-')}"}
            ),
            keywords=[topic, "guide", "tutorial", "best practices", "2024"],
            trend_score=fallback_score
        )

# API Endpoints
@app.get("/", response_model=Dict[str, str])
async def root():
    return {"message": "TrendWeaver Engine API is running", "version": "0.1.0"}

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        service="agent-backend",
        cached_topics=len(seo_cache)
    )

@app.get("/trending-topics", response_model=List[str])
async def get_trending_topics():
    return TRENDING_TOPICS

@app.get("/get-latest-seo", response_model=TrendResponse)
async def get_latest_seo(topic: Optional[str] = None):
    if topic is None:
        topic = random.choice(TRENDING_TOPICS)

    cached = get_from_cache(topic)
    if cached:
        expires_at = seo_cache[topic]["timestamp"] + timedelta(seconds=CACHE_TTL_SECONDS)
        return TrendResponse(
            topic=topic,
            seo_metadata=cached,
            generated_at=seo_cache[topic]["timestamp"].isoformat(),
            cache_expires_at=expires_at.isoformat(),
            is_cached=True
        )

    seo_metadata = generate_seo_with_openai(topic)
    store_in_cache(topic, seo_metadata)

    expires_at = datetime.now() + timedelta(seconds=CACHE_TTL_SECONDS)
    return TrendResponse(
        topic=topic,
        seo_metadata=seo_metadata,
        generated_at=datetime.now().isoformat(),
        cache_expires_at=expires_at.isoformat(),
        is_cached=False
    )

@app.post("/api/analyze-trend", response_model=TrendResponse)
async def analyze_trend(topic: str):
    cached = get_from_cache(topic)
    if cached:
        expires_at = seo_cache[topic]["timestamp"] + timedelta(seconds=CACHE_TTL_SECONDS)
        return TrendResponse(
            topic=topic,
            seo_metadata=cached,
            generated_at=seo_cache[topic]["timestamp"].isoformat(),
            cache_expires_at=expires_at.isoformat(),
            is_cached=True
        )

    seo_metadata = generate_seo_with_openai(topic)
    store_in_cache(topic, seo_metadata)

    expires_at = datetime.now() + timedelta(seconds=CACHE_TTL_SECONDS)
    return TrendResponse(
        topic=topic,
        seo_metadata=seo_metadata,
        generated_at=datetime.now().isoformat(),
        cache_expires_at=expires_at.isoformat(),
        is_cached=False
    )

@app.delete("/cache/{topic}")
async def clear_cache(topic: str):
    if topic in seo_cache:
        del seo_cache[topic]
        return {"message": f"Cache cleared for topic: {topic}"}
    raise HTTPException(status_code=404, detail="Topic not found in cache")

@app.delete("/cache")
async def clear_all_cache():
    seo_cache.clear()
    return {"message": "All cache cleared"}

@app.get("/dashboard-stats", response_model=DashboardStats)
async def get_dashboard_stats():
    tracked_keywords = [
        TrackedKeyword(keyword="AI coding assistants", volume=142000, trend="rising", score=0.92),
        TrackedKeyword(keyword="Serverless infrastructure", volume=98000, trend="stable", score=0.85),
        TrackedKeyword(keyword="Edge computing", volume=87500, trend="rising", score=0.88),
        TrackedKeyword(keyword="LLM fine-tuning", volume=76000, trend="rising", score=0.91),
        TrackedKeyword(keyword="RAG architecture", volume=65000, trend="rising", score=0.87),
        TrackedKeyword(keyword="AI agent frameworks", volume=54000, trend="rising", score=0.89),
        TrackedKeyword(keyword="Kubernetes operators", volume=43000, trend="stable", score=0.78),
        TrackedKeyword(keyword="DevSecOps automation", volume=38000, trend="stable", score=0.75),
    ]

    return DashboardStats(
        current_trending_keyword=random.choice(TRENDING_TOPICS),
        win_potential=random.randint(72, 94),
        overall_seo_score=random.randint(58, 82),
        metadata_synced=97,
        cached_topics=len(seo_cache),
        crawler_visits_today=random.randint(12, 45),
        tracked_keywords=tracked_keywords,
        last_updated=datetime.now().isoformat(),
        agent_status="active"
    )
