import { render, screen } from "@testing-library/react";
import AIRevolutionArticle from "@/app/articles/ai-revolution/page";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe("AI Revolution Article Page", () => {
  it("renders the article title", () => {
    render(<AIRevolutionArticle />);
    expect(
      screen.getByText(/The AI Revolution/)
    ).toBeInTheDocument();
  });

  it("renders the back to home link", () => {
    render(<AIRevolutionArticle />);
    const backLink = screen.getByText(/← Back to Home/);
    expect(backLink).toBeInTheDocument();
    expect(backLink.getAttribute("href")).toBe("/");
  });

  it("renders article content sections", () => {
    render(<AIRevolutionArticle />);
    expect(
      screen.getByText(/The Rise of AI Coding Assistants/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Impact on Software Development/)
    ).toBeInTheDocument();
  });

  it("renders SEO status notice", () => {
    render(<AIRevolutionArticle />);
    expect(screen.getByText(/SEO Status/)).toBeInTheDocument();
  });

  it("renders publication date and read time", () => {
    render(<AIRevolutionArticle />);
    expect(screen.getByText("July 20, 2026")).toBeInTheDocument();
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });
});
