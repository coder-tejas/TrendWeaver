import { render, screen } from "@testing-library/react";
import FutureOfCloudArticle from "@/app/articles/future-of-cloud/page";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe("Future of Cloud Article Page", () => {
  it("renders the article title", () => {
    render(<FutureOfCloudArticle />);
    expect(
      screen.getByText(/The Future of Cloud Computing/)
    ).toBeInTheDocument();
  });

  it("renders the back to home link", () => {
    render(<FutureOfCloudArticle />);
    const backLink = screen.getByText(/← Back to Home/);
    expect(backLink).toBeInTheDocument();
    expect(backLink.getAttribute("href")).toBe("/");
  });

  it("renders article content sections", () => {
    render(<FutureOfCloudArticle />);
    expect(
      screen.getByText(/Serverless Architecture Goes Mainstream/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Edge Computing Revolution/)
    ).toBeInTheDocument();
  });

  it("renders SEO status notice", () => {
    render(<FutureOfCloudArticle />);
    expect(screen.getByText(/SEO Status/)).toBeInTheDocument();
  });

  it("renders publication date and read time", () => {
    render(<FutureOfCloudArticle />);
    expect(screen.getByText("July 18, 2026")).toBeInTheDocument();
    expect(screen.getByText("7 min read")).toBeInTheDocument();
  });
});
