import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import type { Product } from "../types/Product";

export default function ProductDetails() {
  const { id } = useParams();
  const [item, setItem] = useState<Product | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    api<Product>(`/products/${id}`)
      .then(setItem)
      .catch((e) => setError(e.message));
  }, [id]);

  return (
    <div style={{ padding: 12 }}>
      <Link to="/">← Back</Link>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {item && (
        <>
          <h2>{item.name}</h2>
          <p>Price: {item.price}</p>
          <p>Stock: {item.stock}</p>
        </>
      )}
    </div>
  );
}