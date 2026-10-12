import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App, { buildICS } from "./App.jsx";

// A minimal valid week: 5 days, no pauses, 8h each, no off days.
const days = [
  { start: 9, end: 17, pauses: [], locked: false, offDay: false, offHours: 0 },
  { start: 9, end: 17, pauses: [], locked: false, offDay: false, offHours: 0 },
  { start: 9, end: 17, pauses: [], locked: false, offDay: false, offHours: 0 },
  { start: 9, end: 17, pauses: [], locked: false, offDay: false, offHours: 0 },
  { start: 9, end: 17, pauses: [], locked: false, offDay: false, offHours: 0 },
];
const monday = new Date(2026, 9, 12); // Mon 2026-10-12

describe("buildICS", () => {
  it("produces a valid .ics calendar with one event per working day", () => {
    const ics = buildICS(days, monday);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    // 5 working days -> 5 VEVENTs
    const events = ics.split("BEGIN:VEVENT").length - 1;
    expect(events).toBe(5);
    // Each event has a UID, DTSTART, DTEND, SUMMARY
    expect(ics).toContain("UID:weeklie-");
    expect(ics).toContain("DTSTART;TZID=Europe/Berlin:");
    expect(ics).toContain("SUMMARY:Planned Working Block");
  });

  it("skips off days", () => {
    const withOff = days.map((d, i) => (i === 2 ? { ...d, offDay: true } : d));
    const ics = buildICS(withOff, monday);
    const events = ics.split("BEGIN:VEVENT").length - 1;
    expect(events).toBe(4);
  });
});

describe("App export UI", () => {
  it("renders the .ics download button and NOT the Google Calendar button", () => {
    render(<App />);
    // The .ics download affordance is present.
    expect(screen.getByText("Download .ics file")).toBeTruthy();
    // The removed Google Calendar button must be gone.
    expect(screen.queryByText("Add to Google Calendar")).toBeNull();
  });
});
