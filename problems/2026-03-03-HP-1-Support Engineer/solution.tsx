import React, { useEffect, useState } from "react";

type Line = { id: string; name: string; ordered: number; fulfilled: number };
type Order = { id: string; customer: string; lines: Line[] };

async function getOrder(id: string): Promise<Order> {
  await new Promise((r) => setTimeout(r, 120));
  if (id === "FAIL") throw new Error("Order not found");
  return {
    id,
    customer: "Delicious Ideas",
    lines: [
      { id: "a", name: "Hake Butter 6 Pack", ordered: 12, fulfilled: 12 },
      { id: "b", name: "Hake Rosemary 6 Pack", ordered: 12, fulfilled: 0 },
    ],
  };
}

export default function MiniOrderEditor() {
  const [orderId, setOrderId] = useState("PO-123");
  const [order, setOrder] = useState<Order | null>(null);
  const [fulfilled, setFulfilled] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getOrder(orderId)
      .then((o) => {
        setOrder(o);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [orderId]);

  const totalFulfilled = (order?.lines || []).reduce((sum, l) => {
    const v = fulfilled[l.id] ?? l.fulfilled;
    return sum + v;
  }, 0);

  function onChangeQty(lineId: string, raw: string) {
    const qty = Number(raw);
    setFulfilled((prev) => ({
      ...prev,
      [lineId]: qty,
    }));
  }

  function save() {
    if (!order) {
      setError("No order");
      return;
    }
    setError("");
    alert("Saved!");
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 12, maxWidth: 520 }}>
      <h3>Order Editor</h3>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order ID (try FAIL)"
        />
        <button onClick={save} disabled={loading}>
          Save
        </button>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {loading && <p>Loading…</p>}

      {order && (
        <ul>
          {order.lines.map((l) => (
            <li key={l.id}>
              {l.name} — ordered {l.ordered}
              <input
                type="number"
                value={fulfilled[l.id] ?? l.fulfilled}
                onChange={(e) => onChangeQty(l.id, e.target.value)}
                style={{ width: 80, marginLeft: 8 }}
              />
            </li>
          ))}
        </ul>
      )}

      <small>Total fulfilled: {totalFulfilled}</small>
    </div>
  );
}
