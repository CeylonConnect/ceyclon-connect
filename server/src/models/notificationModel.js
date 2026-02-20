import pool from "../config/database.js";

let ensuredSchemaPromise = null;

async function ensureNotificationsSchema() {
  if (ensuredSchemaPromise) return ensuredSchemaPromise;

  ensuredSchemaPromise = (async () => {
    await pool.query(
      `
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NULL,
        link VARCHAR(255) NULL,
        metadata TEXT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        read_at DATETIME NULL,
        CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `
    );

    // MySQL doesn't support CREATE INDEX IF NOT EXISTS, so ignore duplicates.
    try {
      await pool.query(
        "CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at)"
      );
    } catch (err) {
      const code = err?.code || err?.errno;
      // ER_DUP_KEYNAME / ER_DUP_INDEX
      if (code === "ER_DUP_KEYNAME" || code === "ER_DUP_INDEX") return;
    }
  })().catch((err) => {
    // Allow retry in case DB wasn't ready
    ensuredSchemaPromise = null;
    throw err;
  });

  return ensuredSchemaPromise;
}

const safeJsonStringify = (value) => {
  if (value === undefined) return null;
  if (value === null) return null;
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
};

const tryParseJson = (value) => {
  if (value == null) return null;
  if (typeof value !== "string") return value;
  const s = value.trim();
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return value;
  }
};

function normalizeRow(row) {
  if (!row) return row;
  return {
    ...row,
    metadata: tryParseJson(row.metadata),
    is_read: Boolean(row.is_read),
  };
}

const Notification = {
  async create({
    user_id,
    type,
    title,
    message = null,
    link = null,
    metadata,
  }) {
    await ensureNotificationsSchema();

    const insert = await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, link, metadata)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        Number(user_id),
        String(type || "general"),
        String(title || "Notification"),
        message == null ? null : String(message),
        link == null ? null : String(link),
        safeJsonStringify(metadata),
      ]
    );

    const created = await pool.query(
      "SELECT * FROM notifications WHERE notification_id = ?",
      [insert.insertId]
    );

    return normalizeRow(created.rows[0]);
  },

  async createForRole(
    role,
    { type, title, message = null, link = null, metadata }
  ) {
    await ensureNotificationsSchema();

    const r = String(role || "")
      .toLowerCase()
      .trim();
    if (!r) throw new Error("role is required");

    // Treat guide/local as the same role for targeting.
    const roleWhere =
      r === "local"
        ? "LOWER(u.role) IN ('local','guide')"
        : "LOWER(u.role) = ?";

    const result = await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, link, metadata)
       SELECT u.user_id, ?, ?, ?, ?, ?
       FROM users u
       WHERE ${roleWhere}`,
      [
        String(type || "general"),
        String(title || "Notification"),
        message == null ? null : String(message),
        link == null ? null : String(link),
        safeJsonStringify(metadata),
        ...(r === "local" ? [] : [r]),
      ]
    );

    return { created: result.affectedRows ?? 0 };
  },

  async listForUser(
    userId,
    { limit = 10, offset = 0, unreadOnly = false } = {}
  ) {
    await ensureNotificationsSchema();

    const uid = Number(userId);
    const lim = Math.max(1, Math.min(50, Number(limit) || 10));
    const off = Math.max(0, Number(offset) || 0);

    let query =
      "SELECT * FROM notifications WHERE user_id = ?" +
      (unreadOnly ? " AND is_read = 0" : "") +
      " ORDER BY created_at DESC LIMIT ? OFFSET ?";

    const result = await pool.query(query, [uid, lim, off]);
    return (result.rows || []).map(normalizeRow);
  },

  async getUnreadCount(userId) {
    await ensureNotificationsSchema();

    const uid = Number(userId);
    const result = await pool.query(
      "SELECT COUNT(*) AS cnt FROM notifications WHERE user_id = ? AND is_read = 0",
      [uid]
    );
    return Number(result.rows[0]?.cnt || 0);
  },

  async markRead(userId, notificationId) {
    await ensureNotificationsSchema();

    const uid = Number(userId);
    const nid = Number(notificationId);
    await pool.query(
      "UPDATE notifications SET is_read = 1, read_at = COALESCE(read_at, NOW()) WHERE notification_id = ? AND user_id = ?",
      [nid, uid]
    );
    const result = await pool.query(
      "SELECT * FROM notifications WHERE notification_id = ? AND user_id = ?",
      [nid, uid]
    );
    return normalizeRow(result.rows[0]);
  },

  async markAllRead(userId) {
    await ensureNotificationsSchema();

    const uid = Number(userId);
    const result = await pool.query(
      "UPDATE notifications SET is_read = 1, read_at = COALESCE(read_at, NOW()) WHERE user_id = ? AND is_read = 0",
      [uid]
    );
    return { updated: result.affectedRows ?? 0 };
  },
};

export default Notification;
