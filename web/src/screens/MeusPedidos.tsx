import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersMock, Order } from '../data/ordersMock';

function statusColor(status: Order['status']) {
  if (status === 'Pendente') return '#F59E0B';
  if (status === 'Em Processamento') return '#A78BFA';
  if (status === 'Enviado') return '#3B82F6';
  if (status === 'Entregue') return '#10B981';
  return '#EF4444';
}

export default function MeusPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { setOrders(ordersMock); }, []);
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, color: 'var(--dx-text)' }}>Meus Pedidos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {orders.map(o => (
          <div key={o.id} style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16, backgroundColor: 'var(--dx-surface)', boxShadow: 'var(--dx-shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 700, color: 'var(--dx-text)' }}>#{o.id}</div>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: statusColor(o.status), padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{o.status}</span>
            </div>
            <div style={{ color: 'rgba(229,229,229,0.70)', fontSize: 14, marginBottom: 8 }}>{o.date}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#FF6B00', marginBottom: 12 }}>R$ {o.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link 
                to={`/pedido/${o.id}`}
                style={{ flex: 1, padding: '10px 16px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, backgroundColor: 'transparent', color: 'var(--dx-text)', textDecoration: 'none', textAlign: 'center', fontWeight: 500, transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.color = '#FF6B00'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'var(--dx-text)'; }}
              >
                Ver detalhes
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}