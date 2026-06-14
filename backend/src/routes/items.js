import { Router } from "express";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

const CATEGORIES = ["Genel", "Ders", "Kişisel", "Ödev"];

router.get("/meta/categories", (_req, res) => {
  res.json({ categories: CATEGORIES });
});

router.get("/", (req, res) => {
  const { search, category } = req.query;
  let sql = "SELECT id, title, description, category, created_at, updated_at FROM items WHERE user_id = ?";
  const params = [req.user.id];

  if (category && CATEGORIES.includes(category)) {
    sql += " AND category = ?";
    params.push(category);
  }
  if (search?.trim()) {
    sql += " AND (title LIKE ? OR description LIKE ?)";
    const term = `%${search.trim()}%`;
    params.push(term, term);
  }

  sql += " ORDER BY updated_at DESC";

  const items = db.prepare(sql).all(...params);
  res.json({ items });
});

router.get("/:id", (req, res) => {
  const item = db
    .prepare(
      "SELECT id, title, description, category, created_at, updated_at FROM items WHERE id = ? AND user_id = ?"
    )
    .get(req.params.id, req.user.id);

  if (!item) {
    return res.status(404).json({ error: "Not bulunamadı." });
  }

  res.json({ item });
});

router.post("/", (req, res) => {
  const { title, description = "", category = "Genel" } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ error: "Başlık gereklidir." });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Geçersiz kategori." });
  }

  const result = db
    .prepare(
      "INSERT INTO items (user_id, title, description, category) VALUES (?, ?, ?, ?)"
    )
    .run(req.user.id, title.trim(), description.trim(), category);

  const item = db
    .prepare(
      "SELECT id, title, description, category, created_at, updated_at FROM items WHERE id = ?"
    )
    .get(result.lastInsertRowid);

  res.status(201).json({ item });
});

router.put("/:id", (req, res) => {
  const { title, description = "", category = "Genel" } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ error: "Başlık gereklidir." });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Geçersiz kategori." });
  }

  const existing = db
    .prepare("SELECT id FROM items WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: "Not bulunamadı." });
  }

  db.prepare(
    "UPDATE items SET title = ?, description = ?, category = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?"
  ).run(title.trim(), description.trim(), category, req.params.id, req.user.id);

  const item = db
    .prepare(
      "SELECT id, title, description, category, created_at, updated_at FROM items WHERE id = ?"
    )
    .get(req.params.id);

  res.json({ item });
});

router.delete("/:id", (req, res) => {
  const result = db
    .prepare("DELETE FROM items WHERE id = ? AND user_id = ?")
    .run(req.params.id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Not bulunamadı." });
  }

  res.json({ message: "Not başarıyla silindi." });
});

export default router;
