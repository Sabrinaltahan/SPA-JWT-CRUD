import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api/client";
import type { Product } from "../types/Product";

export default function Admin() {
  const [items, setItems] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  async function load() {
    try {
      const data = await api<Product[]>("/products");
      setItems(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }

useEffect(() => {
  let alive = true;

  (async () => {
    try {
      const data = await api<Product[]>("/products");
      if (alive) setItems(data);
    } catch (err) {
      if (alive && err instanceof Error) setError(err.message);
    }
  })();

  return () => {
    alive = false;
  };
}, []);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editingId !== null) {
        await api<Product>(`/products/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api<Product>("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setForm({ name: "", price: "", stock: "" });
      setEditingId(null);
      await load();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      stock: String(p.stock),
    });
  }

  async function onDelete(id: number) {
    setError("");
    try {
      await api(`/products/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
        />
        <input
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
        />

        <button type="submit">
          {editingId !== null ? "Update" : "Create"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", price: "", stock: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr style={{ margin: "16px 0" }} />

      <ul style={{ display: "grid", gap: 8, padding: 0, listStyle: "none" }}>
        {items.map((p) => (
          <li
            key={p.id}
            style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}
          >
            <b>{p.name}</b> — {p.price} AED — stock: {p.stock}
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button type="button" onClick={() => startEdit(p)}>
                Edit
              </button>
              <button type="button" onClick={() => onDelete(p.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}