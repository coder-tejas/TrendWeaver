import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AI_BOTS = [
  "GPTBot",
  "Google-Extended",
  "Googlebot",
  "ChatGPT-User",
  "CCBot",
  "anthropic-ai",
  "ClaudeBot",
  "PerplexityBot",
  "YouBot",
];

function detectCrawler(userAgent: string | null): { isBot: boolean; botName: string } {
  if (!userAgent) return { isBot: false, botName: "" };

  for (const bot of AI_BOTS) {
    if (userAgent.toLowerCase().includes(bot.toLowerCase())) {
      return { isBot: true, botName: bot };
    }
  }
  return { isBot: false, botName: "" };
}

function logCrawlerVisit(
  botName: string,
  pathname: string,
  userAgent: string,
  ip: string | null
) {
  const timestamp = new Date().toISOString();
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`🤖 AI CRAWLER DETECTED: ${botName}`);
  console.log("───────────────────────────────────────────────────────────");
  console.log(`  Timestamp : ${timestamp}`);
  console.log(`  Path      : ${pathname}`);
  console.log(`  User-Agent: ${userAgent}`);
  console.log(`  IP        : ${ip || "unknown"}`);
  console.log("═══════════════════════════════════════════════════════════");
}

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent");
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || null;

  const { isBot, botName } = detectCrawler(userAgent);

  if (isBot) {
    logCrawlerVisit(botName, pathname, userAgent || "", ip);
  }

  const response = NextResponse.next();

  if (isBot) {
    response.headers.set("X-Bot-Detected", "true");
    response.headers.set("X-Bot-Name", botName);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
