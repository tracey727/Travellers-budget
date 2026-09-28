/**
 * Password hashing.
 *
 * The case that matters most is the boring one: the iteration count is
 * stored alongside the hash, and `verifyPassword` must actually use the
 * stored count rather than a hardcoded one — otherwise raising it later
 * would lock out every existing account.
 */

import { hashPassword, verifyPassword } from "../src/lib/auth/password";

let pass = 0, fail = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a === e) { pass++; } else { fail++; console.log(`FAIL ${name}\n  got: ${a}\n  exp: ${e}`); }
}

const PASSWORD = "correct horse battery staple";

async function hashAt(password: string, iterations: number): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256,
  );
  const b64 = (bytes: Uint8Array) => {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  };
  return `pbkdf2-sha256$${iterations}$${b64(salt)}$${b64(new Uint8Array(bits))}`;
}

async function main() {
  const hash = await hashPassword(PASSWORD);

  check("a hash names its algorithm and cost", hash.split("$").slice(0, 2), ["pbkdf2-sha256", "100000"]);
  check("the right password verifies", await verifyPassword(PASSWORD, hash), true);
  check("a wrong password does not", await verifyPassword("not the password", hash), false);
  check("an empty password does not", await verifyPassword("", hash), false);

  const second = await hashPassword(PASSWORD);
  check("the same password hashes differently each time", hash === second, false);
  check("and both still verify", await verifyPassword(PASSWORD, second), true);

  check("a genuine 50k-iteration hash still verifies", await verifyPassword(PASSWORD, await hashAt(PASSWORD, 50_000)), true);

  const relabelled = (await hashAt(PASSWORD, 50_000)).replace("$50000$", "$100000$");
  check("a relabelled cost breaks verification", await verifyPassword(PASSWORD, relabelled), false);

  check("a hash with too few parts is refused", await verifyPassword(PASSWORD, "pbkdf2-sha256$100000$onlythree"), false);
  check("an unknown algorithm is refused", await verifyPassword(PASSWORD, "scrypt$100000$c2FsdA==$aGFzaA=="), false);
  check("a zero iteration count is refused", await verifyPassword(PASSWORD, "pbkdf2-sha256$0$c2FsdA==$aGFzaA=="), false);
  check("a non-numeric count is refused", await verifyPassword(PASSWORD, "pbkdf2-sha256$many$c2FsdA==$aGFzaA=="), false);
  check("rubbish is refused", await verifyPassword(PASSWORD, "not a hash at all"), false);
  check("an empty stored hash is refused", await verifyPassword(PASSWORD, ""), false);

  console.log(`\npassword: ${pass} passed, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

main();
