import { useEffect, useState } from 'react';
import { listOrders, updateOrderStatus } from '../services/api';

type OrderItem = { id: string; name: string; qty: number; price: number };
type Order = { id: string; status: string; customer?: { nome?: string }; items: OrderItem[] };

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const refresh = () => listOrders().then((o: unknown) => setOrders(Array.isArray(o) ? o as Order[] : []));
  useEffect(() => { refresh(); }, []);
  const setStatus = async (id: string, status: string) => { await updateOrderStatus(id, status); refresh(); };
  return (
    <div>
      <h2>Gerenciar Pedidos</h2>
      {orders.map(o => (
        <div key={o.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Pedido {o.id.slice(0, 8)}</div>
            <div>Status: {o.status}</div>
          </div>
          <div>Cliente: {o.customer?.nome}</div>
          <div>Itens:</div>
          {o.items.map((i: OrderItem) => (
            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{i.name} x {i.qty}</span>
              <span>R$ {(i.price * i.qty).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => setStatus(o.id, 'Processando')}>Processando</button>
            <button onClick={() => setStatus(o.id, 'Enviado')}>Enviado</button>
            <button onClick={() => setStatus(o.id, 'Concluído')}>Concluído</button>
          </div>
        </div>
      ))}
    </div>
  );
}