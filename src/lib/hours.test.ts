import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ALWAYS_OPEN,
  UNKNOWN_HOURS,
  getBaltimoreClock,
  getOpenStatus,
  getOpenStatusAt,
  parseHoursSpec,
  weekly,
} from "./hours.ts";

describe("getOpenStatusAt", () => {
  const daily = weekly([{ days: [0, 1, 2, 3, 4, 5, 6], open: "10:45", close: "22:00" }]);

  it("marks a same-day window open inside the range and closed at close", () => {
    assert.equal(getOpenStatusAt(daily, { weekday: 2, minutes: 10 * 60 + 45 }), "open");
    assert.equal(getOpenStatusAt(daily, { weekday: 2, minutes: 21 * 60 + 59 }), "open");
    assert.equal(getOpenStatusAt(daily, { weekday: 2, minutes: 22 * 60 }), "closed");
    assert.equal(getOpenStatusAt(daily, { weekday: 2, minutes: 9 * 60 }), "closed");
  });

  it("handles overnight windows across midnight", () => {
    const late = weekly([{ days: [5], open: "11:00", close: "03:00" }]);
    assert.equal(getOpenStatusAt(late, { weekday: 5, minutes: 23 * 60 }), "open");
    assert.equal(getOpenStatusAt(late, { weekday: 6, minutes: 2 * 60 + 59 }), "open");
    assert.equal(getOpenStatusAt(late, { weekday: 6, minutes: 3 * 60 }), "closed");
    assert.equal(getOpenStatusAt(late, { weekday: 5, minutes: 10 * 60 }), "closed");
  });

  it("treats a midnight close as the end of that calendar day", () => {
    const untilMidnight = weekly([{ days: [5, 6], open: "11:00", close: "00:00" }]);
    assert.equal(getOpenStatusAt(untilMidnight, { weekday: 5, minutes: 23 * 60 + 59 }), "open");
    assert.equal(getOpenStatusAt(untilMidnight, { weekday: 6, minutes: 0 }), "closed");
    assert.equal(getOpenStatusAt(untilMidnight, { weekday: 6, minutes: 11 * 60 }), "open");
  });

  it("respects closed days and unknown / always-open specs", () => {
    const weekdays = weekly([{ days: [1, 2, 3, 4, 5], open: "06:00", close: "15:00" }]);
    assert.equal(getOpenStatusAt(weekdays, { weekday: 0, minutes: 10 * 60 }), "closed");
    assert.equal(getOpenStatusAt(UNKNOWN_HOURS, { weekday: 1, minutes: 12 * 60 }), "unknown");
    assert.equal(getOpenStatusAt(ALWAYS_OPEN, { weekday: 0, minutes: 3 * 60 }), "open");
  });
});

describe("getBaltimoreClock", () => {
  it("reads Tuesday noon Eastern from a known UTC instant", () => {
    const clock = getBaltimoreClock(new Date("2026-09-08T16:00:00.000Z"));
    assert.equal(clock.weekday, 2);
    assert.equal(clock.minutes, 12 * 60);
    assert.equal(
      getOpenStatus(
        weekly([{ days: [2], open: "11:00", close: "13:00" }]),
        new Date("2026-09-08T16:00:00.000Z"),
      ),
      "open",
    );
  });
});

describe("parseHoursSpec", () => {
  it("accepts valid weekly JSON and rejects junk as unknown", () => {
    const parsed = parseHoursSpec({
      kind: "weekly",
      windows: [{ days: [1, 2], open: "08:00", close: "16:00" }],
    });
    assert.equal(parsed.kind, "weekly");
    assert.equal(parseHoursSpec({ kind: "weekly", windows: [] }).kind, "unknown");
    assert.equal(parseHoursSpec(null).kind, "unknown");
    assert.equal(parseHoursSpec({ kind: "always_open" }).kind, "always_open");
  });
});
