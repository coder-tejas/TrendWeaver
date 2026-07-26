"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TrackedKeyword {
  keyword: string;
  volume: number;
  trend: string;
  score: number;
}

interface DashboardStats {
  current_trending_keyword: string;
  win_potential: number;
  overall_seo_score: number;
  metadata_synced: number;
  cached_topics: number;
  crawler_visits_today: number;
  tracked_keywords: TrackedKeyword[];
  last_updated: string;
  agent_status: string;
}

const MOCK_STATS: DashboardStats = {
  current_trending_keyword: "AI coding assistants",
  win_potential: 87,
  overall_seo_score: 64,
  metadata_synced: 97,
  cached_topics: 3,
  crawler_visits_today: 28,
  tracked_keywords: [
    { keyword: "AI coding assistants", volume: 142000, trend: "rising", score: 0.92 },
    { keyword: "Serverless infrastructure", volume: 98000, trend: "stable", score: 0.85 },
    { keyword: "Edge computing", volume: 87500, trend: "rising", score: 0.88 },
    { keyword: "LLM fine-tuning", volume: 76000, trend: "rising", score: 0.91 },
    { keyword: "RAG architecture", volume: 65000, trend: "rising", score: 0.87 },
    { keyword: "AI agent frameworks", volume: 54000, trend: "rising", score: 0.89 },
    { keyword: "Kubernetes operators", volume: 43000, trend: "stable", score: 0.78 },
    { keyword: "DevSecOps automation", volume: 38000, trend: "stable", score: 0.75 },
  ],
  last_updated: new Date().toISOString(),
  agent_status: "active",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:8000/dashboard-stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        setStats(MOCK_STATS);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
              TW
            </div>
            <div>
              <h1 className="text-lg font-semibold">TrendWeaver</h1>
              <p className="text-xs text-gray-400">Execution Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm text-green-400 font-medium">Live</span>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Current Trending Keyword */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Trending Keyword</p>
            <p className="text-xl font-bold text-white truncate">{stats.current_trending_keyword}</p>
            <p className="text-xs text-blue-400 mt-2">Active now</p>
          </div>

          {/* Win Potential */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Win Potential</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-green-400">{stats.win_potential}%</p>
            </div>
            <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                style={{ width: `${stats.win_potential}%` }}
              />
            </div>
          </div>

          {/* Overall SEO Score */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">SEO Score</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-blue-400">{stats.overall_seo_score}</p>
              <p className="text-sm text-gray-500 mb-1">/100</p>
            </div>
            <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                style={{ width: `${stats.overall_seo_score}%` }}
              />
            </div>
          </div>

          {/* Crawler Visits */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Crawler Visits Today</p>
            <p className="text-3xl font-bold text-purple-400">{stats.crawler_visits_today}</p>
            <p className="text-xs text-gray-500 mt-2">GPTBot + Googlebot</p>
          </div>
        </div>

        {/* Metadata Synced & Agent Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Metadata Synced */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-300">Metadata Synced</p>
              <p className="text-2xl font-bold text-white">{stats.metadata_synced}%</p>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.metadata_synced}%` }}
              />
            </div>
            <div className="flex justify-between mt-3 text-xs text-gray-500">
              <span>Last sync: {new Date(stats.last_updated).toLocaleTimeString()}</span>
              <span>Refreshes every 5 min</span>
            </div>
          </div>

          {/* Agent Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-sm font-medium text-gray-300 mb-4">Agent Status</p>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${stats.agent_status === "active" ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-lg font-semibold capitalize">{stats.agent_status}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Cached Topics</span>
                <span className="text-white">{stats.cached_topics}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Backend</span>
                <span className="text-green-400">Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tracked Keywords Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold">Tracked Keywords</h2>
            <p className="text-sm text-gray-400 mt-1">Real-time trend monitoring</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  <th className="px-6 py-3">Keyword</th>
                  <th className="px-6 py-3">Volume</th>
                  <th className="px-6 py-3">Trend</th>
                  <th className="px-6 py-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {stats.tracked_keywords.map((kw, i) => (
                  <tr
                    key={kw.keyword}
                    className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                      i === 0 ? "bg-gray-800/20" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {i === 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 rounded-full">
                            HOT
                          </span>
                        )}
                        <span className="font-medium text-white">{kw.keyword}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {kw.volume.toLocaleString()}/mo
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          kw.trend === "rising"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {kw.trend === "rising" ? "↑" : "→"} {kw.trend}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              kw.score >= 0.9
                                ? "bg-green-500"
                                : kw.score >= 0.8
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            }`}
                            style={{ width: `${kw.score * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-300">{Math.round(kw.score * 100)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
