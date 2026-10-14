import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const wrangler = fs.readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8");
const health = fs.readFileSync(new URL("../src/app/api/health/route.ts", import.meta.url), "utf8");
const schema = fs.readFileSync(new URL("../drizzle/0000_nostalgic_jimmy_woo.sql", import.meta.url), "utf8");

test("the real app targets an isolated Worker, not the exposed legacy placeholder", () => {
  assert.match(wrangler, /"name"\s*:\s*"wayfarer-budget"/);
  assert.doesNotMatch(wrangler, /"name"\s*:\s*"travellers-budget"/);
  assert.match(wrangler, /"main"\s*:\s*"\.open-next\/worker\.js"/);
});

test("production deployment requires encrypted runtime credential names", () => {
  assert.match(wrangler, /"secrets"\s*:\s*\{\s*"required"\s*:\s*\[\s*"DATABASE_URL"\s*,\s*"SESSION_SECRET"\s*\]/);
  assert.doesNotMatch(wrangler, /^\s*"vars"\s*:/m);
  assert.doesNotMatch(wrangler, /postgres(?:ql)?:\/\/[^/\s]+:[^@\s]+@/);
});

test("the production health gate checks real database access and exposes no credential", () => {
  assert.match(health, /missingEnv\(\)/);
  assert.match(health, /db\(\)\.execute\(sql`select 1`\)/);
  assert.match(health, /database: "unreachable"/);
  assert.doesNotMatch(health, /DATABASE_URL\s*:/);
});

test("the matching initial migration declares the five required isolated app tables", () => {
  for (const table of ["users", "sessions", "trips", "budget_categories", "expenses"]) {
    assert.ok(schema.includes('CREATE TABLE "'+table+'"'), "missing "+table);
  }
  assert.equal((schema.match(/CREATE TABLE "/g) || []).length,5);
});


test("all health outcomes identify the exact standalone Worker", () => {
  assert.equal((health.match(/service: "wayfarer-budget"/g) || []).length, 3);
  assert.doesNotMatch(health, /ensureSchema|CREATE TABLE|ALTER TABLE/);
});
