import { useCart } from "../contexts/CartContext";
import { createPayment } from "../services/api";
import { useState } from "react";
import { Link } from "react-router-dom";

type CartItem = { id: string; name: string; price: number; qty: number };
type FormData = {
  nome: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export default function Checkout() {
  const ctx = useCart();
  const items = (ctx?.items || []) as CartItem[];
  const total = ctx?.total as () => number;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const frete = items.length > 0 ? 19.90 : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof FormData;
    setForm({ ...form, [key]: e.target.value });
  };

  const finalizar = async () => {
    if (!form.nome || !form.email || !form.telefone) {
      alert("Preencha nome, email e telefone.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customer: {
          name: form.nome,
          email: form.email,
          phone: form.telefone,
          address: {
            cep: form.cep,
            street: form.endereco,
            number: form.numero,
            district: form.bairro,
            city: form.cidade,
            uf: form.estado,
          }
        },
        items: items.map((item: CartItem) => ({
          id: item.id,
          title: item.name,
          quantity: item.qty,
          unit_price: item.price,
        })),
        shipping: {
          value: frete
        }
      };

      const res = await createPayment(payload);

      if (!res.init_point) {
        alert("Erro ao criar pagamento.");
        setLoading(false);
        return;
      }

      window.location.href = res.init_point;

    } catch (err) {
      console.error(err);
      alert("Falha ao iniciar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: "24px", color: "var(--dx-text)" }}>
        <h2>Seu carrinho está vazio</h2>
        <Link to="/produtos" style={{ color: "#FF6B00" }}>Voltar para produtos</Link>
      </div>
    );
  }

  return (
    <div style={{
      padding: "24px",
      maxWidth: "1100px",
      margin: "0 auto",
      color: "var(--dx-text)"
    }}>
      <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>Finalizar Pedido</h2>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>

        {/* FORM */}
        <div style={{
          padding: "24px",
          backgroundColor: "var(--dx-surface)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.12)"
        }}>
          <h3 style={{ marginBottom: "16px" }}>Seus Dados</h3>

          <div style={{ display: "grid", gap: "12px" }}>
            {[
              ["nome", "Nome completo"],
              ["email", "Email"],
              ["telefone", "Telefone"],
              ["cep", "CEP"],
              ["endereco", "Endereço"],
              ["numero", "Número"],
              ["bairro", "Bairro"],
              ["cidade", "Cidade"],
              ["estado", "Estado"],
            ].map(([key, label]) => (
              <input
                key={key}
                name={key}
                placeholder={label}
                value={form[key as keyof FormData]}
                onChange={handleChange}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backgroundColor: "var(--dx-bg)",
                  color: "var(--dx-text)"
                }}
              />
            ))}
          </div>
        </div>

        {/* RESUMO */}
        <div style={{
          padding: "24px",
          backgroundColor: "var(--dx-surface)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.12)"
        }}>
          <h3 style={{ marginBottom: "24px" }}>Resumo</h3>

          {items.map((item: CartItem) => (
            <div key={item.id} style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px"
            }}>
              <span>{item.name} x {item.qty}</span>
              <span>R$ {(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}

          <hr style={{ margin: "16px 0", borderColor: "rgba(255,255,255,0.12)" }} />

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px"
          }}>
            <span>Subtotal</span>
            <span>R$ {total().toFixed(2)}</span>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px"
          }}>
            <span>Frete</span>
            <span>R$ {frete.toFixed(2)}</span>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: "20px",
            marginTop: "12px"
          }}>
            <span>Total</span>
            <span>R$ {(total() + frete).toFixed(2)}</span>
          </div>

          <button
            onClick={finalizar}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "24px",
              padding: "14px",
              fontSize: "16px",
              fontWeight: 700,
              backgroundColor: loading ? "rgba(255,107,0,0.5)" : "#FF6B00",
              color: "#0F0F0F",
              borderRadius: "8px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Processando..." : "Ir para pagamento"}
          </button>
        </div>

      </div>
    </div>
  );
}
