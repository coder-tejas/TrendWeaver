from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx

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

class SEOMetadata(BaseModel):
    title: str
    description: str
    keywords: List[str]
    og_title: Optional[str] = None
    og_description: Optional[str] = None

class TrendRequest(BaseModel):
    topic: str
    target_audience: Optional[str] = None

class TrendResponse(BaseModel):
    trend_score: float
    keywords: List[str]
    seo_metadata: SEOMetadata

@app.get("/")
async def root():
    return {"message": "TrendWeaver Engine API is running", "version": "0.1.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "agent-backend"}

@app.post("/api/analyze-trend", response_model=TrendResponse)
async def analyze_trend(request: TrendRequest):
    # Placeholder for AI agent logic
    # This will be implemented to detect trends and generate SEO metadata
    
    # Mock response for now
    seo_metadata = SEOMetadata(
        title=f"SEO Optimized: {request.topic}",
        description=f"Comprehensive guide about {request.topic} - latest trends and insights",
        keywords=[request.topic, "trending", "SEO", "guide"],
        og_title=f"{request.topic} - TrendWeaver",
        og_description=f"Discover the latest trends in {request.topic}"
    )
    
    return TrendResponse(
        trend_score=0.85,
        keywords=[request.topic, "trending", "popular", "2024"],
        seo_metadata=seo_metadata
    )

@app.post("/api/generate-metadata", response_model=SEOMetadata)
async def generate_metadata(request: TrendRequest):
    # Placeholder for metadata generation
    return SEOMetadata(
        title=f"Auto-generated: {request.topic}",
        description=f"Automatically generated SEO content for {request.topic}",
        keywords=[request.topic, "auto-generated", "SEO"]
    )
