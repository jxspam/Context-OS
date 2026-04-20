import { describe, it, expect } from "vitest";
import { parseFilter, matchesFilter, toISODate } from "./filters";

describe("parseFilter", () => {
  it("defaults to today when the value is missing or invalid", () => {
    expect(parseFilter(undefined)).toBe("today");
    expect(parseFilter(null)).toBe("today");
    expect(parseFilter("")).toBe("today");
    expect(parseFilter("bogus")).toBe("today");
  });

  it("returns the literal when value is today/upcoming/all", () => {
    expect(parseFilter("today")).toBe("today");
    expect(parseFilter("upcoming")).toBe("upcoming");
    expect(parseFilter("all")).toBe("all");
  });

  it("uses the first entry when value is an array", () => {
    expect(parseFilter(["upcoming", "today"])).toBe("upcoming");
    expect(parseFilter(["bogus"])).toBe("today");
  });
});

describe("matchesFilter", () => {
  const today = "2026-04-20";

  it("'all' matches every task, including those with no due date", () => {
    expect(matchesFilter(null, "all", today)).toBe(true);
    expect(matchesFilter("2026-04-20T00:00:00+00:00", "all", today)).toBe(true);
    expect(matchesFilter("2020-01-01T00:00:00+00:00", "all", today)).toBe(true);
  });

  it("'today' matches rows whose due_date shares today's ISO date", () => {
    expect(matchesFilter("2026-04-20T00:00:00+00:00", "today", today)).toBe(
      true,
    );
    expect(matchesFilter("2026-04-20T23:59:59+00:00", "today", today)).toBe(
      true,
    );
    expect(matchesFilter("2026-04-21T00:00:00+00:00", "today", today)).toBe(
      false,
    );
    expect(matchesFilter(null, "today", today)).toBe(false);
  });

  it("'upcoming' matches strictly future due_dates", () => {
    expect(matchesFilter("2026-04-21T00:00:00+00:00", "upcoming", today)).toBe(
      true,
    );
    expect(matchesFilter("2026-04-20T23:59:59+00:00", "upcoming", today)).toBe(
      false,
    );
    expect(matchesFilter(null, "upcoming", today)).toBe(false);
  });
});

describe("toISODate", () => {
  it("formats a Date as YYYY-MM-DD in UTC", () => {
    expect(toISODate(new Date("2026-04-20T15:30:00Z"))).toBe("2026-04-20");
    expect(toISODate(new Date("2026-01-01T00:00:00Z"))).toBe("2026-01-01");
  });
});
