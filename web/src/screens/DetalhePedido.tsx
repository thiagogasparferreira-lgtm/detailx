import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ordersMock } from '../data/ordersMock';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/useToast';

export default function DetalhePedido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { showToast, ToastContainer } = useToast();

  const order = useMemo(() => ordersMock.find(o => o.id === id), [id]);

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#1a1a1a' }}>
        <h2>Pedido não encontrado</h2>
        <Link to="/meus-pedidos" style={{ display: 'inline-block', marginTop: 16, padding: '10px 16px', backgroundColor: '#3B82F6', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>Voltar</Link>
      </div>
    );
  }

  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const frete = 19.9;
  const total = subtotal + frete;

  const repetirCompra = () => {
    order.items.forEach(i => {
      add({ id: i.productId, name: i.name, price: i.price }, i.qty);
    });
    showToast('Itens adicionados ao carrinho!', 'success');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px', backgroundColor: '#ffffff', color: '#1a1a1a' }}>
      <ToastContainer />
      <div style={{ marginBottom: 16 }}>
        <Link to="/" style={{ color: '#4a4a4a', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px', color: '#999' }}>›</span>
        <Link to="/meus-pedidos" style={{ color: '#4a4a4a', textDecoration: 'none' }}>Meus Pedidos</Link>
        <span style={{ margin: '0 8px', color: '#999' }}>›</span>
        <span style={{ color: '#1a1a1a', fontWeight: 600 }}>#{order.id}</span>
      </div>

      <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: 8 }}>Pedido #{order.id}</h2>
      <div style={{ color: '#6B7280', marginBottom: 16 }}>{order.date} • {order.status}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Itens do pedido</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {order.items.map(i => (
                <div key={i.productId} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px', alignItems: 'center' }}>
                  <div style={{ color: '#111827' }}>{i.name}</div>
                  <div style={{ color: '#6B7280' }}>Qtd: {i.qty}</div>
                  <div style={{ textAlign: 'right', fontWeight: 600 }}>R$ {(i.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Endereço de entrega</h3>
            <div style={{ color: '#4a4a4a' }}>{order.address}</div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={repetirCompra}
              style={{ flex: 1, padding: '12px 16px', border: 'none', borderRadius: 8, backgroundColor: '#3B82F6', color: '#fff', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563EB'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3B82F6'; }}
            >
              Repetir compra
            </button>
            <button 
              onClick={() => navigate('/meus-pedidos')}
              style={{ padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: 8, backgroundColor: '#fff', color: '#374151', fontWeight: 500, cursor: 'pointer' }}
            >
              Voltar
            </button>
          </div>
        </div>

        <div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Resumo</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Frete</span>
                <span>R$ {frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#111827' }}>
                <span>Total</span>
                <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}