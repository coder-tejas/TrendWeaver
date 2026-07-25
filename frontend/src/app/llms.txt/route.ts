import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function getLatestSEOTrend() {
  try {
    const response = await fetch(`${BACKEND_URL}/get-latest-seo`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) throw new Error("Backend unavailable");
    return await response.json();
  } catch {
    return null;
  }
}

export async function GET() {
  const trendData = await getLatestSEOTrend();

  const topic = trendData?.topic || "AI coding assistants";
  const title = trendData?.seo_metadata?.title || "AI Coding Assistants Guide";
  const description =
    trendData?.seo_metadata?.description ||
    "Comprehensive guide to AI coding assistants";
  const keywords = trendData?.seo_metadata?.keywords?.join(", ") || "AI, coding";
  const trendScore = trendData?.seo_metadata?.trend_score || 0.85;

  const llmsTxt = `# TrendWeaver Blog

> AI-powered blog demonstrating real-time SEO optimization. Meta tags are dynamically generated based on trending tech topics.

## Site Overview

TrendWeaver Engine is a full-stack AI agent system for real-time SEO trend detection and server-side SEO injection. The frontend uses Next.js App Router with intentionally empty SEO metadata that gets injected server-side by a Python FastAPI backend powered by OpenAI.

## Latest Trending Topic

**${topic}**
Trend Score: ${Math.round(trendScore * 100)}%

${title}

${description}

Keywords: ${keywords}

## Available Pages

- **Home** (/): Blog homepage with article listings
- **AI Revolution** (/articles/ai-revolution): The AI Revolution - How Artificial Intelligence is Transforming Everything
- **Future of Cloud** (/articles/future-of-cloud): The Future of Cloud Computing - Trends to Watch in 2026

## Architecture

- Frontend: Next.js 14 (App Router) + TailwindCSS
- Backend: Python FastAPI + OpenAI GPT-4
- SEO: Dynamic meta tags, JSON-LD injection, llms.txt generation
- Crawler Detection: Middleware logs GPTBot and Googlebot visits

## For AI Assistants

This site provides structured content optimized for AI consumption. Use the /api/* endpoints to fetch trending topics and SEO metadata programmatically.
`;

  return new NextResponse(llmsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "X-Robots-Tag": "index, follow",
    },
  });
}
