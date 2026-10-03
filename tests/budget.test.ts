import { daysBetween, tripLengthLabel, deriveStatus } from "../src/lib/dates";

let pass = 0, fail = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a === e) { pass++; } else { fail++; console.log(`FAIL ${name}\n  got: ${a}\n  exp: ${e}`); }
}

function main() {
  check("a single day trip spans one day", daysBetween("2026-03-10", "2026-03-10"), 1);
  check("a week trip spans eight inclusive days", daysBetween("2026-03-10", "2026-03-17"), 8);

  check("a day trip is labelled as such", tripLengthLabel("2026-03-10", "2026-03-10"), "Day trip");
  check("a one-night trip is singular", tripLengthLabel("2026-03-10", "2026-03-11"), "1 night");
  check("a multi-night trip is plural", tripLengthLabel("2026-03-10", "2026-03-17"), "7 nights");

  const past = { start: "2020-01-01", end: "2020-01-10" };
  const future = { start: "2099-01-01", end: "2099-01-10" };
  check("a trip entirely in the past is completed", deriveStatus(past.start, past.end), "completed");
  check("a trip entirely in the future is planning", deriveStatus(future.start, future.end), "planning");

  console.log(`\nbudget: ${pass} passed, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

main();
