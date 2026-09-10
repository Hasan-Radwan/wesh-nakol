-- ══ وش ناكل؟ — مخطط قاعدة بيانات D1 ══

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'open',   -- open | closed
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS options (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  name       TEXT NOT NULL,
  emoji      TEXT NOT NULL DEFAULT '🍽️',
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);
CREATE INDEX IF NOT EXISTS idx_options_session ON options(session_id);

CREATE TABLE IF NOT EXISTS votes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL,
  option_id   INTEGER NOT NULL,
  voter_name  TEXT NOT NULL DEFAULT 'ضيف',
  device_hash TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- صوت واحد لكل جهاز في كل جلسة (تغيير الصوت يستبدل السابق)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_vote_device ON votes(session_id, device_hash);
