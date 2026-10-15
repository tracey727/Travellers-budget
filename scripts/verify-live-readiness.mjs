import assert from 'node:assert/strict';

// Fixed public origin; no credentials, cookies, owner or customer data.
const origin = 'https://wayfarer-budget.positivity864.workers.dev';

async function get(path, limit = 1024 * 1024) {
  const response = await fetch(new URL(path, origin), {
    method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(20000),
    headers: {accept: path === '/api/health' ? 'application/json' : 'text/html'}
  });
  let bytes = 0;
  const chunks = [];
  const reader = response.body?.getReader();
  if (reader) {
    try {
      for (;;) {
        const {done, value} = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > limit) throw Error('Response exceeds verification limit');
        chunks.push(value);
      }
    } finally {
      await reader.cancel().catch(() => {});
      reader.releaseLock();
    }
  }
  const body = Buffer.concat(chunks).toString('utf8');
  return {status: response.status, type: response.headers.get('content-type') || '',
    location: response.headers.get('location'), body};
}

const health = await get('/api/health', 16384);
assert.equal(health.status, 200, 'Live health HTTP status');
assert.match(health.type, /application\/json/i, 'Live health content type');
const value = JSON.parse(health.body);
assert.equal(value.service, 'wayfarer-budget', 'Exact standalone identity');
assert.equal(value.status, 'ok', 'Required runtime settings');
assert.equal(value.database, 'ok', 'Read-only SELECT 1 connectivity');
assert.deepEqual(value.missingEnv, [], 'No missing required settings');
console.log('PASS: exact Wayfarer identity, required runtime settings and read-only DB query');

const home = await get('/');
assert.equal(home.status, 200, 'Public home status');
assert.match(home.type, /text\/html/i);
assert.match(home.body, /Wayfarer/i, 'Public product home');
console.log('PASS: public home HTML');

const login = await get('/login');
assert.equal(login.status, 200, 'Login page status');
assert.match(login.type, /text\/html/i);
assert.match(login.body, /<input\b[^>]*\btype="email"/i, 'Email input is rendered');
assert.match(login.body, /<input\b[^>]*\btype="password"/i, 'Password input is rendered');
console.log('PASS: login page renders email and password inputs');

const app = await get('/app');
assert.ok([302, 303, 307, 308].includes(app.status), 'Signed-out app route must redirect');
const target = new URL(app.location || '', origin);
assert.equal(target.origin, origin, 'Auth redirect stays on this app');
assert.equal(target.pathname, '/login', 'Signed-out app redirects to login');
console.log('PASS: anonymous private-app route is guarded');
console.log('LIMIT: no authenticated signup, saved-trip/expense write, owner-isolation or logout proof is claimed');
