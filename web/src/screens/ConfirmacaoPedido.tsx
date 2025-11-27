import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrder } from "../services/api";

type OrderItem = { id: string; quantity: number };
type Order = { id: string; status: string; items: OrderItem[]; subtotal: number; frete: number; total: number };

export default function ConfirmacaoPedido() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Atualiza o status automaticamente a cada 5s
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const data = await getOrder(id);
        setOrder(data);
      } catch (err) {
        console.error("Erro ao buscar pedido:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "24px", color: "var(--dx-text)" }}>
        <h2>Carregando pedido...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: "24px", color: "var(--dx-text)" }}>
        <h2>Pagamento iniciado</h2>
        <p style={{ color: "rgba(229,229,229,0.75)" }}>Aguarde o retorno do provedor de pagamento ou verifique seu email.</p>
        <Link style={{ color: "#FF6B00" }} to="/produtos">Voltar para a loja</Link>
      </div>
    );
  }

  const statusColorMap: Record<string, string> = {
    approved: "#22c55e",
    pending: "#d97706",
    rejected: "#dc2626",
  };
  const statusColor = statusColorMap[order.status] || "rgba(229,229,229,0.75)";

  return (
    <div style={{
      padding: "24px",
      maxWidth: "800px",
      margin: "0 auto",
      color: "var(--dx-text)"
    }}>
      <h2 style={{ marginBottom: "16px" }}>Pedido #{order.id}</h2>

      {/* Status */}
      <div style={{
        padding: "12px 16px",
        borderRadius: "8px",
        backgroundColor: "var(--dx-surface)",
        border: "1px solid rgba(255,255,255,0.12)",
        marginBottom: "24px"
      }}>
        <strong>Status:</strong>{" "}
        <span style={{ color: statusColor, fontWeight: 700 }}>
          {order.status === "approved"
            ? "Pagamento aprovado"
            : order.status === "pending"
            ? "Pagamento pendente"
            : order.status === "rejected"
            ? "Pagamento recusado"
            : order.status}
        </span>
      </div>

      {/* Itens */}
      <div style={{
        backgroundColor: "var(--dx-surface)",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.12)",
        marginBottom: "24px"
      }}>
        <h3 style={{ marginBottom: "16px" }}>Itens do pedido</h3>

        {order.items.map((item: OrderItem) => (
          <div key={item.id} style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px"
          }}>
            <span>{item.id} x {item.quantity}</span>
          </div>
        ))}

        <hr style={{ margin: "16px 0", borderColor: "rgba(255,255,255,0.10)" }} />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Subtotal:</span>
          <strong>R$ {(order.subtotal / 100).toFixed(2)}</strong>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Frete:</span>
          <strong>R$ {(order.frete / 100).toFixed(2)}</strong>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "12px",
          fontSize: "20px"
        }}>
          <span>Total:</span>
          <strong style={{ color: "#FF6B00" }}>
            R$ {(order.total / 100).toFixed(2)}
          </strong>
        </div>
      </div>

      {/* Botão final */}
      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <Link
          to="/produtos"
          style={{
            display: "inline-block",
            padding: "14px 24px",
            backgroundColor: "#FF6B00",
            color: "#0F0F0F",
            fontWeight: 700,
            borderRadius: "8px",
            textDecoration: "none"
          }}
        >
          Continuar comprando
        </Link>
      </div>
    </div>
  );
}
