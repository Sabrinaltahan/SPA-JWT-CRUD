import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Product } from "../types/Product";

export default function Home() {
  const [items, setItems] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Product[]>("/products")
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 12 }}>Loading...</p>;
  if (error) return <p style={{ padding: 12, color: "crimson" }}>{error}</p>;

  return (
    <div style={{ padding: 12 }}>
      <h2>Products</h2>
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.name}</Link> — {p.price} kr — stock: {p.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}