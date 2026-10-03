import { toNumber, formatMoney, formatMoneyCompact, toMoneyString, percent } from "../src/lib/money";

let pass = 0, fail = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a === e) { pass++; } else { fail++; console.log(`FAIL ${name}\n  got: ${a}\n  exp: ${e}`); }
}

function main() {
  check("toNumber parses a decimal string", toNumber("1234.50"), 1234.5);
  check("toNumber treats null as zero", toNumber(null), 0);
  check("toNumber treats undefined as zero", toNumber(undefined), 0);
  check("toNumber rejects garbage as zero", toNumber("not a number"), 0);

  check("formatMoney renders USD", formatMoney(1234.5, "USD"), "$1,234.50");
  check("formatMoney renders a whole number with cents", formatMoney(10, "USD"), "$10.00");
  check("formatMoney falls back for an unknown currency code", formatMoney(10, "ZZZ").includes("10"), true);

  check("formatMoneyCompact drops cents on a whole amount", formatMoneyCompact(1200, "USD"), "$1,200");
  check("formatMoneyCompact keeps cents when present", formatMoneyCompact(1200.5, "USD"), "$1,200.50");

  check("toMoneyString rounds to cents", toMoneyString(10.005), "10.01");
  check("toMoneyString keeps two decimals", toMoneyString(10), "10.00");

  check("percent of zero whole is zero, not NaN or Infinity", percent(50, 0), 0);
  check("percent computes a normal ratio", percent(50, 200), 25);
  check("percent never goes negative", percent(-10, 200), 0);

  console.log(`\nmoney: ${pass} passed, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

main();
