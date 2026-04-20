export type Filter = "today" | "upcoming" | "all";

export function parseFilter(
  value: string | string[] | null | undefined,
): Filter {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (candidate === "upcoming" || candidate === "all") return candidate;
  return "today";
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function matchesFilter(
  dueDate: string | null,
  filter: Filter,
  today: string,
): boolean {
  if (filter === "all") return true;
  if (!dueDate) return false;
  const datePart = dueDate.slice(0, 10);
  if (filter === "today") return datePart === today;
  return datePart > today;
}
