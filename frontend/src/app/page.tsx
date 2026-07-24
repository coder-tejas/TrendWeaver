import Link from "next/link";

export default function Home() {
  const articles = [
    {
      slug: "ai-revolution",
      title: "The AI Revolution: How Artificial Intelligence is Transforming Everything",
      excerpt: "Explore the latest advancements in AI and how they're reshaping industries worldwide.",
      date: "July 20, 2026",
      readTime: "5 min read",
    },
    {
      slug: "future-of-cloud",
      title: "The Future of Cloud Computing: Trends to Watch in 2026",
      excerpt: "From edge computing to serverless architectures, discover what's next in cloud technology.",
      date: "July 18, 2026",
      readTime: "7 min read",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">TrendWeaver Blog</h1>
          <p className="text-gray-600 mt-1">AI-powered insights on trending tech topics</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Welcome to TrendWeaver</h2>
            <p className="text-lg opacity-90">
              This blog demonstrates real-time SEO optimization powered by AI.
              Meta tags are dynamically generated based on trending topics.
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Latest Articles</h2>
          <div className="grid gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{article.date}</span>
                  <span className="mx-2">·</span>
                  <span>{article.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Notice */}
        <section className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            🔍 SEO Status: Empty
          </h3>
          <p className="text-yellow-700">
            Notice: This page has NO meta tags, title, or JSON-LD schema.
            The AI agent backend will inject optimized SEO metadata server-side.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          TrendWeaver Engine — Powered by AI
        </div>
      </footer>
    </div>
  );
}
