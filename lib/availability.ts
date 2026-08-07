import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { AvailabilityRange, OverlapWindow } from "./types";

export const HORIZON_DAYS = 240;

/** Day key helper */
export function dayKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

/**
 * Collapses everyone's marked ranges into maximal consecutive windows that
 * share the exact same set of available people. Ranked best-first:
 * most people, then longest, then soonest.
 */
export function computeOverlaps(
  ranges: AvailabilityRange[],
  from: Date = new Date(),
): OverlapWindow[] {
  if (ranges.length === 0) return [];

  const start = parseISO(dayKey(from));
  const perDay = new Map<string, Set<string>>();

  for (let i = 0; i < HORIZON_DAYS; i++) {
    perDay.set(dayKey(addDays(start, i)), new Set<string>());
  }

  for (const range of ranges) {
    const rStart = parseISO(range.start_date);
    const rEnd = parseISO(range.end_date);
    const span = differenceInCalendarDays(rEnd, rStart);
    for (let i = 0; i <= span; i++) {
      const key = dayKey(addDays(rStart, i));
      perDay.get(key)?.add(range.user_id);
    }
  }

  const windows: OverlapWindow[] = [];
  let current: { start: string; end: string; ids: string } | null = null;

  for (let i = 0; i < HORIZON_DAYS; i++) {
    const key = dayKey(addDays(start, i));
    const set = perDay.get(key)!;
    const signature = [...set].sort().join(",");

    if (current && current.ids === signature) {
      current.end = key;
      continue;
    }
    if (current && current.ids !== "") {
      windows.push(toWindow(current));
    }
    current = { start: key, end: key, ids: signature };
  }
  if (current && current.ids !== "") windows.push(toWindow(current));

  return windows.sort(
    (a, b) =>
      b.userIds.length - a.userIds.length ||
      b.days - a.days ||
      a.start.localeCompare(b.start),
  );
}

function toWindow(c: {
  start: string;
  end: string;
  ids: string;
}): OverlapWindow {
  return {
    start: c.start,
    end: c.end,
    days: differenceInCalendarDays(parseISO(c.end), parseISO(c.start)) + 1,
    userIds: c.ids.split(","),
  };
}

export function formatWindow(start: string, end: string) {
  const s = parseISO(start);
  const e = parseISO(end);
  if (start === end) return format(s, "EEE d MMM yyyy");
  if (format(s, "yyyy") === format(e, "yyyy")) {
    return `${format(s, "d MMM")} – ${format(e, "d MMM yyyy")}`;
  }
  return `${format(s, "d MMM yyyy")} – ${format(e, "d MMM yyyy")}`;
}
