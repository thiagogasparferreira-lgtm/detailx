import { useEffect, useState } from 'react';
import { getSuppliers } from '../services/api';

type Supplier = { id: string; name: string; contact: string; status: string; stock?: number };

export default function AdminFornecedores() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  useEffect(() => { getSuppliers().then((s: unknown) => setSuppliers(Array.isArray(s) ? s as Supplier[] : [])); }, []);
  return (
    <div>
      <h2>Fornecedores</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {suppliers.map(s => (
          <div key={s.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{s.name}</div>
            <div>Contato: {s.contact}</div>
            <div>Status: {s.status}</div>
            <div>Estoque total: {s.stock}</div>
          </div>
        ))}
      </div>
    </div>
  );
}