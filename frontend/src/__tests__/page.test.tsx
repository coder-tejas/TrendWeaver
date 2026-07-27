import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe("Home Page", () => {
  it("renders the blog title", () => {
    render(<Home />);
    expect(screen.getByText("TrendWeaver Blog")).toBeInTheDocument();
  });

  it("renders the hero section", () => {
    render(<Home />);
    expect(screen.getByText("Welcome to TrendWeaver")).toBeInTheDocument();
  });

  it("renders article cards", () => {
    render(<Home />);
    expect(
      screen.getByText(/The AI Revolution/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The Future of Cloud Computing/)
    ).toBeInTheDocument();
  });

  it("renders article links with correct paths", () => {
    render(<Home />);
    const links = screen.getAllByRole("link");
    const articleLinks = links.filter((link) =>
      link.getAttribute("href")?.startsWith("/articles/")
    );
    expect(articleLinks.length).toBe(2);
  });

  it("renders SEO status notice", () => {
    render(<Home />);
    expect(screen.getByText(/SEO Status: Empty/)).toBeInTheDocument();
  });

  it("renders footer", () => {
    render(<Home />);
    expect(
      screen.getByText("TrendWeaver Engine — Powered by AI")
    ).toBeInTheDocument();
  });
});
