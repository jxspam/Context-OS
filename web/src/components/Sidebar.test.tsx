import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const useSearchParamsMock = vi.fn(() => new URLSearchParams());

vi.mock("next/navigation", () => ({
  useSearchParams: () => useSearchParamsMock(),
}));

import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  beforeEach(() => {
    useSearchParamsMock.mockReset();
    useSearchParamsMock.mockReturnValue(new URLSearchParams());
  });

  it("exposes Today, Upcoming, and All as filter links", () => {
    render(<Sidebar />);
    expect(screen.getByRole("link", { name: /today/i })).toHaveAttribute(
      "href",
      "/?filter=today",
    );
    expect(screen.getByRole("link", { name: /upcoming/i })).toHaveAttribute(
      "href",
      "/?filter=upcoming",
    );
    expect(screen.getByRole("link", { name: /^all$/i })).toHaveAttribute(
      "href",
      "/?filter=all",
    );
  });

  it("highlights Today by default when no filter query is present", () => {
    render(<Sidebar />);
    expect(
      screen.getByRole("link", { name: /today/i }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: /upcoming/i }),
    ).not.toHaveAttribute("aria-current");
    expect(
      screen.getByRole("link", { name: /^all$/i }),
    ).not.toHaveAttribute("aria-current");
  });

  it("highlights Upcoming when filter=upcoming", () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams("filter=upcoming"));
    render(<Sidebar />);
    expect(
      screen.getByRole("link", { name: /upcoming/i }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: /today/i }),
    ).not.toHaveAttribute("aria-current");
  });

  it("highlights All when filter=all", () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams("filter=all"));
    render(<Sidebar />);
    expect(
      screen.getByRole("link", { name: /^all$/i }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: /today/i }),
    ).not.toHaveAttribute("aria-current");
  });

  it("falls back to Today when filter value is unrecognised", () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams("filter=bogus"));
    render(<Sidebar />);
    expect(
      screen.getByRole("link", { name: /today/i }),
    ).toHaveAttribute("aria-current", "page");
  });
});
