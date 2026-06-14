import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";
import Brand from "../components/Brand.jsx";

const DEFAULT_CATEGORIES = ["Genel", "Ders", "Kişisel", "Ödev"];

function formatDate(iso) {
  if (!iso) return "";
  const normalized = iso.includes("T") ? iso : iso.replace(" ", "T");
  return new Date(normalized).toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function EditModal({ item, categories, onClose, onSave }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || "");
  const [category, setCategory] = useState(item.category);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave({ title, description, category });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="edit-title">
        <h2 id="edit-title">Notu düzenle</h2>
        {error && <div className="form-error" style={{ marginBottom: "1rem" }}>{error}</div>}
        <form className="item-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-title-input">Başlık</label>
              <input
                id="edit-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-category">Kategori</label>
              <select id="edit-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="edit-desc">İçerik</label>
            <textarea id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Genel");
  const [adding, setAdding] = useState(false);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [editingItem, setEditingItem] = useState(null);

  const loadItems = useCallback(async () => {
    setError("");
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (filterCategory) params.category = filterCategory;
      const { items: data } = await api.getItems(params);
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  }, [search, filterCategory]);

  useEffect(() => {
    api.getCategories().then(({ categories: cats }) => setCategories(cats)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadItems().finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [loadItems]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    setError("");
    try {
      await api.createItem({ title, description, category });
      setTitle("");
      setDescription("");
      setCategory("Genel");
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu notu silmek istediğinize emin misiniz?")) return;
    setError("");
    try {
      await api.deleteItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, body) => {
    const { item } = await api.updateItem(id, body);
    setItems((prev) => prev.map((i) => (i.id === id ? item : i)));
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <Brand />
        <div className="user-info">
          <span className="db-badge" title="Notlar SQLite veritabanında saklanır">
            ● DB Bağlı
          </span>
          <div className="avatar" title={user?.name}>
            {initials}
          </div>
          <span>{user?.name}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
            Çıkış
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <h1 className="dashboard-title">Not Paneli</h1>
        <p className="dashboard-subtitle">
          Not ekleyin, görüntüleyin ve silin — tüm veriler veritabanına kaydedilir.
        </p>

        {error && <div className="form-error" style={{ marginBottom: "1rem" }}>{error}</div>}

        <section className="panel">
          <h2>Yeni not ekle</h2>
          <form className="item-form" onSubmit={handleAdd}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Başlık</label>
                <input
                  id="title"
                  placeholder="Örn: Matematik ödevi — 5. ünite"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Kategori</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">İçerik</label>
              <textarea
                id="description"
                placeholder="Not detayları, tarih, linkler…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={adding} style={{ alignSelf: "flex-start" }}>
              {adding ? "Ekleniyor…" : "+ Not ekle"}
            </button>
          </form>
        </section>

        <div className="toolbar">
          <div className="search-wrap">
            <input
              type="search"
              placeholder="Notlarda ara…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Notlarda ara"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            aria-label="Kategoriye göre filtrele"
          >
            <option value="">Tüm kategoriler</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="spinner" style={{ margin: "0 auto 1rem" }} />
            Notlar yükleniyor…
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📝</div>
            <p>Henüz not yok. Yukarıdan ilk notunuzu ekleyin.</p>
          </div>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <article key={item.id} className="item-card">
                <div className="item-card-body">
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                  <div className="item-meta">
                    <span className="badge">{item.category}</span>
                    <span>Güncellendi: {formatDate(item.updated_at)}</span>
                  </div>
                </div>
                <div className="item-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditingItem(item)}
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Sil
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {editingItem && (
        <EditModal
          item={editingItem}
          categories={categories}
          onClose={() => setEditingItem(null)}
          onSave={(body) => handleUpdate(editingItem.id, body)}
        />
      )}
    </div>
  );
}
