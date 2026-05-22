import Database from 'better-sqlite3';
import path from 'path';

const CACHE_TTL = 10 * 60 * 1000;

function getDb() {
  const dbDir = process.env.VERCEL ? '/tmp' : '.';
  const dbPath = path.join(dbDir, 'drakor-cache.db');
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS cache (
      key TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `);

  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');

  return db;
}

function getCached(db, key) {
  const row = db.prepare('SELECT data, expires_at FROM cache WHERE key = ?').get(key);
  if (!row) return null;
  if (Date.now() > row.expires_at) {
    db.prepare('DELETE FROM cache WHERE key = ?').run(key);
    return null;
  }
  return JSON.parse(row.data);
}

function setCache(db, key, data) {
  const expires_at = Date.now() + CACHE_TTL;
  db.prepare(
    'INSERT OR REPLACE INTO cache (key, data, expires_at) VALUES (?, ?, ?)'
  ).run(key, JSON.stringify(data), expires_at);
}

function pruneCache(db) {
  db.prepare('DELETE FROM cache WHERE expires_at < ?').run(Date.now());
}

export default async function handler(req, res) {
  const params = new URLSearchParams(req.query);
  if (!params.has('action')) params.set('action', 'latest');
  const cacheKey = params.toString();

  let db;
  try {
    db = getDb();
    pruneCache(db);

    const cached = getCached(db, cacheKey);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached);
    }
  } catch (err) {
    console.error('DB init error:', err);
  }

  const url = `https://wudyver-api.vercel.app/api/film/drakor/v7?${params}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    const data = await response.json();

    if (db) {
      try {
        setCache(db, cacheKey, data);
      } catch (err) {
        console.error('Cache set error:', err);
      }
    }

    try { db?.close(); } catch {}
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(data);
  } catch (err) {
    try { db?.close(); } catch {}
    return res.status(502).json({ error: 'Gagal mengambil data dari server eksternal' });
  }
}
