import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { createPayment } from '../services/api';
import { useNavigate } from 'react-router-dom';

type CartItem = { id: string; name: string; price: number; qty: number };

export default function Checkout() {
  const ctx = useCart();
  const items = (ctx.items || []) as CartItem[];
  const total = ctx.total();
  const clear = ctx.clear;
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const nav = useNavigate();
  const finalizar = async () => {
    const payload = {
      items: items.map((i: CartItem) => ({ id: i.id, title: i.name, quantity: i.qty, unit_price: i.price })),
      shipping: { value: 990 },
    };
    const r = await createPayment(payload);
    if (r?.init_point) {
      clear();
      window.location.href = r.init_point;
      return;
    }
    clear();
    nav('/pedido/confirmacao');
  };
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--dx-bg)', color: 'var(--dx-text)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Checkout</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16, marginBottom: 24, backgroundColor: 'var(--dx-surface)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Endereço</h3>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'rgba(229,229,229,0.80)' }}>Nome</label>
              <input value={nome} onChange={e => setNome(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'var(--dx-surface)', color: 'var(--dx-text)' }} />
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'rgba(229,229,229,0.80)' }}>Endereço</label>
              <input value={endereco} onChange={e => setEndereco(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'var(--dx-surface)', color: 'var(--dx-text)' }} />
            </div>

            <div style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16, marginBottom: 24, backgroundColor: 'var(--dx-surface)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Frete</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--dx-text)' }}>
                  <input type="radio" name="frete" defaultChecked />Econômico — R$ 9,90 — prazo 5-8 dias
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--dx-text)' }}>
                  <input type="radio" name="frete" />Rápido — R$ 19,90 — prazo 1-3 dias
                </label>
              </div>
            </div>

            <div style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16, backgroundColor: 'var(--dx-surface)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Pagamento</h3>
              <div style={{ display: 'flex', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--dx-text)' }}>
                  <input type="radio" name="pagamento" defaultChecked /> Pix
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--dx-text)' }}>
                  <input type="radio" name="pagamento" /> Cartão
                </label>
              </div>
            </div>
          </div>

          <div>
            <div style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16, marginBottom: 24, backgroundColor: 'var(--dx-surface)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--dx-text)' }}>Resumo do Pedido</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {items.length === 0 && (
                  <div style={{ color: 'rgba(229,229,229,0.70)' }}>Seu carrinho está vazio</div>
                )}
                {items.map((i: { id: string; name: string; price: number; qty: number }) => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(229,229,229,0.85)', fontSize: 15 }}>{i.name} x {i.qty}</span>
                    <span style={{ fontWeight: 700, color: 'var(--dx-text)', fontSize: 15 }}>R$ {(i.price * i.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16, backgroundColor: 'var(--dx-surface)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--dx-text)' }}>Total</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(229,229,229,0.80)' }}>Subtotal</span>
                  <span style={{ fontWeight: 600, color: 'var(--dx-text)' }}>R$ {total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(229,229,229,0.80)' }}>Frete (Econômico)</span>
                  <span style={{ fontWeight: 600, color: 'var(--dx-text)' }}>R$ 9,90</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                  <span style={{ color: 'var(--dx-text)' }}>Total</span>
                  <span style={{ color: '#FF6B00', fontSize: 22 }}>R$ {(total + 9.90).toFixed(2)}</span>
                </div>
              </div>

              <button
                disabled={!nome || !endereco || items.length === 0}
                onClick={finalizar}
                style={{ marginTop: 16, width: '100%', padding: '14px 18px', border: 'none', borderRadius: 9999, backgroundColor: (!nome || !endereco || items.length === 0) ? 'rgba(229,229,229,0.35)' : '#FF6B00', color: '#0F0F0F', fontWeight: 700, boxShadow: (!nome || !endereco || items.length === 0) ? 'none' : '0 10px 30px rgba(255,107,0,0.25)', cursor: (!nome || !endereco || items.length === 0) ? 'not-allowed' : 'pointer' }}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}