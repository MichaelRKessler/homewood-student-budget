/**
 * Open-now hours for Homewood spots.
 *
 * Model (America/New_York / Baltimore):
 * - `always_open` — treated as open at every local minute (7-Eleven).
 * - `weekly` — one or more windows. `days` use JS weekday numbers (0 = Sunday).
 *   `open` / `close` are 24h "HH:MM". If close is earlier than or equal to open,
 *   the window crosses midnight onto the next calendar day.
 * - `unknown` — no reliable weekly schedule. Open now never treats these as open.
 *
 * Seed spots that stay unknown: Holy Frijoles, Carma's Cafe.
 */

export const BALTIMORE_TIME_ZONE = "America/New_York";

export const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const EVERY_DAY: Weekday[] = [0, 1, 2, 3, 4, 5, 6];
export const MON_FRI: Weekday[] = [1, 2, 3, 4, 5];
export const SAT_SUN: Weekday[] = [0, 6];

export type HoursWindow = {
  days: Weekday[];
  open: string;
  close: string;
};

export type HoursSpec =
  | { kind: "unknown" }
  | { kind: "always_open" }
  | { kind: "weekly"; windows: HoursWindow[] };

export type OpenStatus = "open" | "closed" | "unknown";

export const UNKNOWN_HOURS: HoursSpec = { kind: "unknown" };
export const ALWAYS_OPEN: HoursSpec = { kind: "always_open" };

export function weekly(windows: HoursWindow[]): HoursSpec {
  return { kind: "weekly", windows };
}

export type ZonedClock = {
  weekday: Weekday;
  minutes: number;
};

const WEEKDAY_FROM_SHORT: Record<string, Weekday> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const TIME_PATTERN = /^(\d{2}):(\d{2})$/;

export function parseClockTime(value: string): number | null {
  const match = TIME_PATTERN.exec(value);
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }
  return hours * 60 + minutes;
}

export function getBaltimoreClock(now: Date, timeZone = BALTIMORE_TIME_ZONE): ZonedClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);

  const weekdayLabel = parts.find((part) => part.type === "weekday")?.value ?? "";
  const weekday = WEEKDAY_FROM_SHORT[weekdayLabel];
  const hourRaw = Number(parts.find((part) => part.type === "hour")?.value);
  const minuteRaw = Number(parts.find((part) => part.type === "minute")?.value);

  if (weekday === undefined || Number.isNaN(hourRaw) || Number.isNaN(minuteRaw)) {
    throw new Error("Could not read America/New_York local time");
  }

  const hour = hourRaw === 24 ? 0 : hourRaw;
  return { weekday, minutes: hour * 60 + minuteRaw };
}

function previousWeekday(weekday: Weekday): Weekday {
  return ((weekday + 6) % 7) as Weekday;
}

function windowIsOpen(window: HoursWindow, clock: ZonedClock): boolean {
  const open = parseClockTime(window.open);
  const close = parseClockTime(window.close);
  if (open === null || close === null) {
    return false;
  }

  const appliesToday = window.days.includes(clock.weekday);
  const appliesYesterday = window.days.includes(previousWeekday(clock.weekday));

  if (close > open) {
    return appliesToday && clock.minutes >= open && clock.minutes < close;
  }

  if (appliesToday && clock.minutes >= open) {
    return true;
  }
  return appliesYesterday && clock.minutes < close;
}

export function getOpenStatusAt(hours: HoursSpec, clock: ZonedClock): OpenStatus {
  if (hours.kind === "unknown") {
    return "unknown";
  }
  if (hours.kind === "always_open") {
    return "open";
  }
  return hours.windows.some((window) => windowIsOpen(window, clock)) ? "open" : "closed";
}

export function getOpenStatus(hours: HoursSpec, now: Date): OpenStatus {
  return getOpenStatusAt(hours, getBaltimoreClock(now));
}

function isWeekday(value: unknown): value is Weekday {
  return typeof value === "number" && (WEEKDAYS as readonly number[]).includes(value);
}

function isHoursWindow(value: unknown): value is HoursWindow {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as { days?: unknown; open?: unknown; close?: unknown };
  if (!Array.isArray(candidate.days) || candidate.days.length === 0) {
    return false;
  }
  if (!candidate.days.every(isWeekday)) {
    return false;
  }
  return (
    typeof candidate.open === "string" &&
    typeof candidate.close === "string" &&
    parseClockTime(candidate.open) !== null &&
    parseClockTime(candidate.close) !== null
  );
}

export function parseHoursSpec(value: unknown): HoursSpec {
  if (typeof value !== "object" || value === null) {
    return UNKNOWN_HOURS;
  }
  const candidate = value as { kind?: unknown; windows?: unknown };
  if (candidate.kind === "always_open") {
    return ALWAYS_OPEN;
  }
  if (candidate.kind === "weekly" && Array.isArray(candidate.windows)) {
    const windows = candidate.windows.filter(isHoursWindow);
    if (windows.length > 0) {
      return { kind: "weekly", windows };
    }
  }
  return UNKNOWN_HOURS;
}

export const UNKNOWN_HOURS_SPOT_IDS = [
  "holy-frijoles",
  "carmas-cafe",
] as const;
