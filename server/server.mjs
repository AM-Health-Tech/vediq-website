import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { EmailClient } from '@azure/communication-email';

const port = Number(process.env.PORT || 8080);
const publicRoot = join(process.cwd(), 'public');
const connectionString = process.env.ACS_EMAIL_CONNECTION_STRING || '';
const senderAddress = process.env.EMAIL_SENDER_ADDRESS || '';
const recipientAddress = process.env.DEMO_RECIPIENT_EMAIL || 'info@vediq.net';
const emailClient = connectionString ? new EmailClient(connectionString) : null;
const requestWindows = new Map();

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(body));
}

function text(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character]);
}

function isRateLimited(request) {
  const forwarded = request.headers['x-forwarded-for'];
  const client = (Array.isArray(forwarded) ? forwarded[0] : forwarded || request.socket.remoteAddress || 'unknown')
    .split(',')[0]
    .trim();
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const recent = (requestWindows.get(client) || []).filter((timestamp) => now - timestamp < windowMs);
  recent.push(now);
  requestWindows.set(client, recent);
  return recent.length > 5;
}

async function readJson(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 16_384) throw new Error('payload_too_large');
  }
  return JSON.parse(body || '{}');
}

async function handleDemoRequest(request, response) {
  if (!emailClient || !senderAddress) {
    sendJson(response, 503, { error: 'Demo requests are temporarily unavailable.' });
    return;
  }
  if (isRateLimited(request)) {
    sendJson(response, 429, { error: 'Too many requests. Please try again later.' });
    return;
  }

  let input;
  try {
    input = await readJson(request);
  } catch {
    sendJson(response, 400, { error: 'The request could not be read.' });
    return;
  }

  // Hidden honeypot field. Bots commonly fill it; people never see it.
  if (text(input.website, 200)) {
    sendJson(response, 202, { ok: true });
    return;
  }

  const firstName = text(input.firstName, 80);
  const lastName = text(input.lastName, 80);
  const workEmail = text(input.workEmail, 254).toLowerCase();
  const organizationName = text(input.organizationName, 160);
  const organizationType = text(input.organizationType, 160);
  const problem = text(input.problem, 2_000);

  if (!firstName || !lastName || !organizationName || !organizationType || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
    sendJson(response, 400, { error: 'Please complete all required fields.' });
    return;
  }

  const fullName = `${firstName} ${lastName}`;
  const lines = [
    `Name: ${fullName}`,
    `Work email: ${workEmail}`,
    `Organization: ${organizationName}`,
    `Organization type: ${organizationType}`,
    '',
    'What they are trying to solve:',
    problem || 'Not provided',
  ];
  const html = `
    <h2>New Vediq demo request</h2>
    <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Work email:</strong> ${escapeHtml(workEmail)}</p>
    <p><strong>Organization:</strong> ${escapeHtml(organizationName)}</p>
    <p><strong>Organization type:</strong> ${escapeHtml(organizationType)}</p>
    <p><strong>What they are trying to solve:</strong></p>
    <p>${escapeHtml(problem || 'Not provided').replace(/\n/g, '<br>')}</p>
  `;

  try {
    const poller = await emailClient.beginSend({
      senderAddress,
      recipients: { to: [{ address: recipientAddress }] },
      replyTo: [{ address: workEmail, displayName: fullName }],
      content: {
        subject: `Vediq demo request — ${organizationName}`,
        plainText: lines.join('\n'),
        html,
      },
    });
    const result = await poller.pollUntilDone();
    if (result.status !== 'Succeeded') throw new Error('Azure email delivery did not succeed.');
    sendJson(response, 202, { ok: true });
  } catch (error) {
    console.error('Demo email delivery failed:', error instanceof Error ? error.message : 'unknown error');
    sendJson(response, 502, { error: 'We could not send your request. Please try again.' });
  }
}

function serveStatic(request, response) {
  const requestPath = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const safePath = normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
  let filePath = join(publicRoot, safePath);

  if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
  if (!existsSync(filePath) && !extname(filePath)) filePath = `${filePath}.html`;

  if (!filePath.startsWith(publicRoot) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  const extension = extname(filePath).toLowerCase();
  const immutable = /[\\/]_next[\\/]static[\\/]/.test(filePath);
  response.writeHead(200, {
    'Content-Type': contentTypes[extension] || 'application/octet-stream',
    'Cache-Control': immutable ? 'public, max-age=604800, immutable' : 'public, max-age=60',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; form-action 'self'; frame-ancestors 'self'; base-uri 'self'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
  });
  createReadStream(filePath).pipe(response);
}

createServer(async (request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname;
  const host = (request.headers.host || '').split(':')[0].toLowerCase();
  if (host === 'www.vediq.net') {
    response.writeHead(308, { Location: `https://vediq.net${request.url || '/'}` });
    response.end();
    return;
  }
  if (pathname === '/healthz') {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('ok');
    return;
  }
  if (pathname === '/api/demo' && request.method === 'POST') {
    await handleDemoRequest(request, response);
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD, POST' });
    response.end();
    return;
  }
  serveStatic(request, response);
}).listen(port, '0.0.0.0', () => {
  console.log(`Vediq website listening on port ${port}`);
});
