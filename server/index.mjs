// Backend "liste d'attente" + service du front (dist/) — zéro dépendance.
// node:http + node:sqlite (Node >= 22.5).
//   Dev   : npm run dev:all   (front sur 5173, API sur 8787)
//   Prod  : npm run build && npm start   (tout sur $PORT, une seule origine)
import { createServer } from 'node:http'
import { DatabaseSync } from 'node:sqlite'
import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, extname, join, normalize } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const DIST = join(HERE, '..', 'dist')
const PORT = Number(process.env.PORT) || 8787
const ADMIN_KEY = process.env.ADMIN_KEY || 'nigelle-dev'
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'
const DB_PATH = process.env.DB_PATH || join(HERE, 'waitlist.db')

const db = new DatabaseSync(DB_PATH)
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    interest   TEXT,
    created_at TEXT NOT NULL,
    user_agent TEXT
  )
`)

const insert = db.prepare(`
  INSERT INTO leads (name, email, interest, created_at, user_agent)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(email) DO UPDATE SET
    name = excluded.name,
    interest = excluded.interest
`)
const listAll = db.prepare(
  `SELECT id, name, email, interest, created_at FROM leads ORDER BY id DESC`,
)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function send(res, status, body, extraHeaders = {}) {
  const isText = typeof body === 'string'
  res.writeHead(status, {
    'content-type': isText
      ? 'text/plain; charset=utf-8'
      : 'application/json; charset=utf-8',
    'access-control-allow-origin': CORS_ORIGIN,
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    ...extraHeaders,
  })
  res.end(isText ? body : JSON.stringify(body))
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json',
}

async function serveStatic(res, pathname) {
  let rel = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '')
  if (rel === '/' || rel === '' || rel === '\\') rel = '/index.html'
  const filePath = join(DIST, rel)
  if (!filePath.startsWith(DIST)) return false // anti path-traversal
  try {
    const s = await stat(filePath)
    if (s.isDirectory()) return false
    const isHtml = extname(filePath) === '.html'
    res.writeHead(200, {
      'content-type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'cache-control': isHtml
        ? 'no-cache'
        : 'public, max-age=31536000, immutable',
    })
    res.end(await readFile(filePath))
    return true
  } catch {
    return false
  }
}

async function serveIndex(res) {
  try {
    res.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-cache',
    })
    res.end(await readFile(join(DIST, 'index.html')))
    return true
  } catch {
    return false
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)

  if (req.method === 'OPTIONS') return send(res, 204, '')

  // --- API : inscription ---
  if (req.method === 'POST' && url.pathname === '/api/waitlist') {
    let raw = ''
    for await (const chunk of req) {
      raw += chunk
      if (raw.length > 10_000) {
        req.destroy()
        return
      }
    }
    let data
    try {
      data = JSON.parse(raw || '{}')
    } catch {
      return send(res, 400, { error: 'Requête invalide.' })
    }
    const name = String(data.name ?? '').trim().slice(0, 120)
    const email = String(data.email ?? '').trim().toLowerCase().slice(0, 200)
    const interest = String(data.interest ?? '').trim().slice(0, 2000) || null

    if (name.length < 2) return send(res, 400, { error: 'Merci d’indiquer votre nom.' })
    if (!EMAIL_RE.test(email)) return send(res, 400, { error: 'Email invalide.' })

    try {
      insert.run(
        name,
        email,
        interest,
        new Date().toISOString(),
        String(req.headers['user-agent'] ?? '').slice(0, 300),
      )
      return send(res, 201, { ok: true })
    } catch {
      return send(res, 500, { error: 'Erreur serveur, réessayez.' })
    }
  }

  // --- API : consultation (protégée par ?key=) ---
  if (
    req.method === 'GET' &&
    (url.pathname === '/api/waitlist' || url.pathname === '/api/waitlist.csv')
  ) {
    if (url.searchParams.get('key') !== ADMIN_KEY) {
      return send(res, 401, { error: 'Clé invalide.' })
    }
    const rows = listAll.all()
    if (url.pathname.endsWith('.csv')) {
      const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
      const csv = [
        'id,name,email,interest,created_at',
        ...rows.map((r) =>
          [r.id, r.name, r.email, r.interest, r.created_at].map(esc).join(','),
        ),
      ].join('\n')
      return send(res, 200, csv, {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': 'attachment; filename="nigelle-royale-leads.csv"',
      })
    }
    return send(res, 200, { count: rows.length, leads: rows })
  }

  // --- Front statique (dist/) + fallback SPA ---
  if (req.method === 'GET' || req.method === 'HEAD') {
    if (await serveStatic(res, url.pathname)) return
    if (await serveIndex(res)) return
  }

  send(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`\n  Nigelle Royale — http://localhost:${PORT}`)
  console.log(`  DB    : ${DB_PATH}`)
  console.log(`  Admin : /api/waitlist?key=${ADMIN_KEY}  (JSON)  ·  .csv pour l'export\n`)
})
