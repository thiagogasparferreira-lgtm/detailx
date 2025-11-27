import { useEffect, useRef, useState } from 'react';
import { adminMetrics, Product } from '../services/api';
import { Link } from 'react-router-dom';

type AdminMetrics = Awaited<ReturnType<typeof adminMetrics>>;

export default function AdminDashboard() {
  const [m, setM] = useState<AdminMetrics | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => { adminMetrics().then(setM); }, []);
  useEffect(() => {
    if (!m || !canvasRef.current) return;
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    const keys = Object.keys(m.salesByDay);
    const vals = keys.map((k: string) => m.salesByDay[k]);
    const max = Math.max(1, ...vals);
    const bw = c.width / Math.max(1, keys.length);
    keys.forEach((k, i) => {
      const h = (vals[i] / max) * (c.height - 20);
      ctx.fillStyle = '#4a90e2';
      ctx.fillRect(i * bw + 4, c.height - h - 10, bw - 8, h);
    });
  }, [m]);
  if (!m) return null;
  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>Total de produtos: {m.totalProducts}</div>
        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>Total de vendas: {m.totalSales}</div>
        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>Total de pedidos: {m.totalOrders}</div>
        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>Receita total: R$ {m.totalRevenue.toFixed(2)}</div>
      </div>
      <h3 style={{ marginTop: 16 }}>Produtos com estoque baixo</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {m.lowStockProducts.map((p: Product) => (
          <div key={p.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
            <img src={p.photoUrl} alt={p.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6 }} />
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div>Estoque: {p.stock}</div>
          </div>
        ))}
      </div>
      <h3 style={{ marginTop: 16 }}>Vendas</h3>
      <canvas ref={canvasRef} width={600} height={220} />
      <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
        <Link to="/admin/produtos">Gerenciar Produtos</Link>
        <Link to="/admin/pedidos">Gerenciar Pedidos</Link>
        <Link to="/admin/fornecedores">Gerenciar Fornecedores</Link>
      </div>
    </div>
  );
}