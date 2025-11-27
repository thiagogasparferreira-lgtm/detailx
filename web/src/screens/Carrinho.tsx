import { useCart } from "../contexts/CartContext";
import { createPayment } from "../services/api";
import { Link } from "react-router-dom";
import { useState } from "react";

type CartItem = { id: string; name: string; price: number; photoUrl?: string; qty: number };

export default function Carrinho() {
  const ctx = useCart();
  const items = (ctx?.items || []) as CartItem[];
  const setQty = ctx?.setQty as (id: string, qty: number) => void;
  const remove = ctx?.remove as (id: string) => void;
  const total = ctx?.total as () => number;
  const [loading, setLoading] = useState(false);

  const frete = items.length > 0 ? 19.90 : 0; // Frete simples (pode alterar)

  const finalizarCompra = async () => {
    try {
      setLoading(true);

      const payload = {
        items: items.map((item) => ({
          id: item.id,
          title: item.name,
          quantity: item.qty,
          unit_price: item.price,
        })),
        shipping: {
          value: frete
        }
      };

      const data = await createPayment(payload);

      if (!data.init_point) {
        alert("Erro ao criar pagamento.");
        setLoading(false);
        return;
      }

      // Redireciona para o Mercado Pago
      window.location.href = data.init_point;

    } catch (err) {
      console.error(err);
      alert("Erro ao iniciar o pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto", color: "var(--dx-text)" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Carrinho</h2>

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h3>Seu carrinho está vazio</h3>
          <Link to="/produtos" style={{ color: "#FF6B00", fontWeight: 600 }}>
            Ver produtos
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          
          {/* LISTA DO CARRINHO */}
          <div>
            {items.map((item: CartItem) => (
              <div key={item.id} style={{
                display: "flex",
                gap: "16px",
                marginBottom: "18px",
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "var(--dx-surface)",
                border: "1px solid rgba(255,255,255,0.12)"
              }}>
                <img
                  src={item.photoUrl || `/product-images/${item.id}.jpg`}
                  onError={(e) => e.currentTarget.src = "/product-images/default.jpg"}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: "4px" }}>{item.name}</h3>
                  <p style={{ color: "rgba(229,229,229,0.65)", marginBottom: "8px" }}>
                    R$ {item.price.toFixed(2)}
                  </p>

                  {/* QUANTIDADE */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <button
                      onClick={() => setQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      style={{
                        padding: "4px 10px",
                        fontSize: "20px",
                        backgroundColor: "var(--dx-bg)",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.12)",
                      cursor: item.qty <= 1 ? "not-allowed" : "pointer"
                      }}
                    >
                      −
                    </button>

                    <span style={{ fontSize: "18px", fontWeight: 600 }}>
                      {item.qty}
                    </span>

                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      style={{
                        padding: "4px 10px",
                        fontSize: "20px",
                        backgroundColor: "var(--dx-bg)",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        cursor: "pointer"
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* REMOVER */}
                  <button
                    onClick={() => remove(item.id)}
                    style={{
                      background: "transparent",
                      color: "#DC2626",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                      marginTop: "4px"
                    }}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RESUMO */}
          <div style={{
            padding: "24px",
            backgroundColor: "var(--dx-surface)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.12)"
          }}>
            <h3 style={{ marginBottom: "24px" }}>Resumo do Pedido</h3>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span>Subtotal</span>
              <span>R$ {total().toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span>Frete</span>
              <span>R$ {frete.toFixed(2)}</span>
            </div>

            <hr style={{ borderColor: "rgba(255,255,255,0.12)", margin: "16px 0" }} />

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "20px",
              fontWeight: 700,
              marginBottom: "24px"
            }}>
              <span>Total</span>
              <span>R$ {(total() + frete).toFixed(2)}</span>
            </div>

            <button
              onClick={finalizarCompra}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "16px",
                fontWeight: 700,
                backgroundColor: loading ? "rgba(255,107,0,0.5)" : "#FF6B00",
                color: "#0F0F0F",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Processando..." : "Finalizar Compra"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
