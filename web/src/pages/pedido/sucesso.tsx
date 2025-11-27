import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrder } from "../../services/api";

type Order = { id: string; total?: number; status?: string };

export default function PedidoSucesso() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const data = await getOrder(id);
        setOrder(data);
      } catch (err) {
        console.error("Erro ao carregar pedido:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "24px", color: "var(--dx-text)" }}>
        <h2>Carregando...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "700px",
        margin: "0 auto",
        color: "var(--dx-text)",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--dx-surface)",
          padding: "32px",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.12)",
          textAlign: "center",
          boxShadow: "var(--dx-shadow)",
        }}
      >
        <h2 style={{ fontSize: "26px", marginBottom: "12px", color: "#22c55e" }}>
          ✅ Pedido Confirmado!
        </h2>

        <p
          style={{
            color: "rgba(229,229,229,0.75)",
            fontSize: "16px",
            marginBottom: "24px",
          }}
        >
          Seu pagamento foi aprovado e seu pedido está sendo processado.
        </p>

        {order && (
          <div
            style={{
              marginBottom: "24px",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "rgba(255,255,255,0.06)",
              fontSize: "14px",
              color: "rgba(229,229,229,0.80)",
            }}
          >
            Pedido: <strong>{order.id}</strong>
            <br />
            Total:{" "}
            <strong>
              R$ {Number(order.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </strong>
            <br />
            Status:{" "}
            <strong style={{ color: "#22c55e" }}>
              {order.status || "aprovado"}
            </strong>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            to="/meus-pedidos"
            style={{
              padding: "14px 24px",
              backgroundColor: "#22c55e",
              color: "#0F0F0F",
              borderRadius: "8px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            📦 Acompanhar Pedido
          </Link>

          <Link
            to="/produtos"
            style={{
              padding: "14px 24px",
              border: "1px solid rgba(255,255,255,0.20)",
              backgroundColor: "transparent",
              color: "var(--dx-text)",
              borderRadius: "8px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            🛍 Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
