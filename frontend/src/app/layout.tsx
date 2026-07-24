import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* SEO Meta Tags - LEFT EMPTY INTENTIONALLY */}
        {/* AI Agent will inject title, description, and JSON-LD here */}
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
