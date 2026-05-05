// src/lib/constants.ts

// Maps database values (1-7) to UI labels
export const DAYS: Record<number, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

// Maps database values (1-10) to Time Slots
// You can adjust these strings to match your exact college timing
export const PERIODS: Record<number, string> = {
  1: "08:00 AM - 09:00 AM",
  2: "09:00 AM - 10:00 AM",
  3: "10:00 AM - 11:00 AM",
  4: "11:00 AM - 12:00 PM",
  5: "12:00 PM - 01:00 PM",
  6: "01:00 PM - 02:00 PM", // Usually Lunch?
  7: "02:00 PM - 03:00 PM",
  8: "03:00 PM - 04:00 PM",
  9: "04:00 PM - 05:00 PM",
  10: "05:00 PM - 06:00 PM",
};

// Helper arrays for mapping in React components
export const DAY_KEYS = Object.keys(DAYS).map(Number);     // [1, 2, 3, 4, 5, 6, 7]
export const PERIOD_KEYS = Object.keys(PERIODS).map(Number); // [1, 2, ... 10]

// Initial Branches for Dropdowns
export const BRANCHES = [
  "CSE",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL",
];