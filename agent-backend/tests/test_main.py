import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta
import json

from main import app, seo_cache, TRENDING_TOPICS, CACHE_TTL_SECONDS

client = TestClient(app)


class TestRootEndpoint:
    def test_root_returns_message(self):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data

    def test_root_message_content(self):
        response = client.get("/")
        data = response.json()
        assert data["version"] == "0.1.0"


class TestHealthEndpoint:
    def test_health_returns_status(self):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "agent-backend"
        assert "cached_topics" in data

    def test_health_cached_topics_count(self):
        seo_cache.clear()
        response = client.get("/health")
        assert response.json()["cached_topics"] == 0


class TestTrendingTopicsEndpoint:
    def test_trending_topics_returns_list(self):
        response = client.get("/trending-topics")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_trending_topics_contains_expected(self):
        response = client.get("/trending-topics")
        data = response.json()
        assert "AI coding assistants" in data
        assert "Serverless infrastructure" in data
        assert "Edge computing" in data


class TestGetLatestSEOEndpoint:
    def setup_method(self):
        seo_cache.clear()

    def test_get_latest_seo_returns_valid_response(self):
        response = client.get("/get-latest-seo")
        assert response.status_code == 200
        data = response.json()
        assert "topic" in data
        assert "seo_metadata" in data
        assert "is_cached" in data

    def test_get_latest_seo_with_specific_topic(self):
        response = client.get("/get-latest-seo?topic=AI coding assistants")
        assert response.status_code == 200
        data = response.json()
        assert data["topic"] == "AI coding assistants"

    def test_get_latest_seo_metadata_structure(self):
        response = client.get("/get-latest-seo?topic=Test Topic")
        data = response.json()
        metadata = data["seo_metadata"]
        assert "title" in metadata
        assert "description" in metadata
        assert "keywords" in metadata
        assert "json_ld" in metadata
        assert "trend_score" in metadata
        assert isinstance(metadata["keywords"], list)
        assert 0 <= metadata["trend_score"] <= 1

    def test_get_latest_seo_json_ld_structure(self):
        response = client.get("/get-latest-seo?topic=Test Topic")
        data = response.json()
        json_ld = data["seo_metadata"]["json_ld"]
        assert json_ld["context"] == "https://schema.org"
        assert json_ld["type"] == "Article"
        assert "headline" in json_ld
        assert "description" in json_ld
        assert "author" in json_ld
        assert "datePublished" in json_ld

    def test_caching_mechanism(self):
        seo_cache.clear()
        response1 = client.get("/get-latest-seo?topic=Cache Test")
        assert response1.json()["is_cached"] is False

        response2 = client.get("/get-latest-seo?topic=Cache Test")
        assert response2.json()["is_cached"] is True

    def test_different_topics_separate_cache(self):
        seo_cache.clear()
        response1 = client.get("/get-latest-seo?topic=Topic A")
        response2 = client.get("/get-latest-seo?topic=Topic B")
        assert response1.json()["topic"] == "Topic A"
        assert response2.json()["topic"] == "Topic B"


class TestDashboardStatsEndpoint:
    def test_dashboard_stats_returns_valid_response(self):
        response = client.get("/dashboard-stats")
        assert response.status_code == 200
        data = response.json()
        assert "current_trending_keyword" in data
        assert "win_potential" in data
        assert "overall_seo_score" in data
        assert "metadata_synced" in data
        assert "tracked_keywords" in data
        assert "agent_status" in data

    def test_dashboard_stats_ranges(self):
        response = client.get("/dashboard-stats")
        data = response.json()
        assert 0 <= data["win_potential"] <= 100
        assert 0 <= data["overall_seo_score"] <= 100
        assert data["metadata_synced"] == 97
        assert data["agent_status"] == "active"

    def test_dashboard_stats_tracked_keywords(self):
        response = client.get("/dashboard-stats")
        data = response.json()
        keywords = data["tracked_keywords"]
        assert isinstance(keywords, list)
        assert len(keywords) > 0
        for kw in keywords:
            assert "keyword" in kw
            assert "volume" in kw
            assert "trend" in kw
            assert "score" in kw


class TestCacheEndpoints:
    def setup_method(self):
        seo_cache.clear()

    def test_clear_specific_cache(self):
        seo_cache["test_topic"] = {"data": "test", "timestamp": datetime.now()}
        response = client.delete("/cache/test_topic")
        assert response.status_code == 200
        assert "test_topic" not in seo_cache

    def test_clear_nonexistent_cache_returns_404(self):
        response = client.delete("/cache/nonexistent")
        assert response.status_code == 404

    def test_clear_all_cache(self):
        seo_cache["topic1"] = {"data": "test1", "timestamp": datetime.now()}
        seo_cache["topic2"] = {"data": "test2", "timestamp": datetime.now()}
        response = client.delete("/cache")
        assert response.status_code == 200
        assert len(seo_cache) == 0


class TestPydanticModels:
    def test_json_ld_schema_validation(self):
        from main import JSONLDSchema
        schema = JSONLDSchema(
            headline="Test Headline",
            description="Test Description",
            author={"@type": "Person", "name": "Test Author"},
            datePublished="2026-07-22T10:00:00",
            dateModified="2026-07-22T10:00:00",
            publisher={"@type": "Organization", "name": "Test Publisher"},
            mainEntityOfPage={"@type": "WebPage", "@id": "https://test.com"}
        )
        assert schema.context == "https://schema.org"
        assert schema.type == "Article"

    def test_seo_metadata_validation(self):
        from main import SEOMetadata, JSONLDSchema
        metadata = SEOMetadata(
            title="Test Title",
            description="Test Description",
            json_ld=JSONLDSchema(
                headline="Test",
                description="Test",
                author={"@type": "Person", "name": "Test"},
                datePublished="2026-07-22T10:00:00",
                dateModified="2026-07-22T10:00:00",
                publisher={"@type": "Organization", "name": "Test"},
                mainEntityOfPage={"@type": "WebPage", "@id": "https://test.com"}
            ),
            keywords=["test", "keyword"],
            trend_score=0.85
        )
        assert metadata.trend_score == 0.85
        assert len(metadata.keywords) == 2
