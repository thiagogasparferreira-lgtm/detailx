import { useEffect, useState } from 'react';
import { adminAddProduct, adminDeleteProduct, adminRefreshPhoto, adminUpdateProduct, adminUpdateStock, getCategories, getProducts, Product } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function AdminProdutos() {
  const { token } = useAuth() || { token: null };
  const [cats, setCats] = useState<string[]>([]);
  const [list, setList] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({ id: '', name: '', description: '', price: 0, rating: 0, stock: 0, supplierId: '', category: '' });
  useEffect(() => { getCategories().then((cs) => setCats(Array.isArray(cs) ? cs : [])); refresh(); }, []);
  const refresh = () => getProducts().then((p) => setList(p));
  const add = async () => { if (!form.id || !token) return; await adminAddProduct(form, token); setForm({ id: '', name: '', description: '', price: 0, rating: 0, stock: 0, supplierId: '', category: '' }); refresh(); };
  const edit = async (p: Product) => { if (!token) return; await adminUpdateProduct(p.id, p, token); refresh(); };
  const remove = async (id: string) => { if (!token) return; await adminDeleteProduct(id, token); refresh(); };
  const setStock = async (id: string, stock: number) => { await adminUpdateStock(id, stock, token || undefined); refresh(); };
  const refreshPhoto = async (id: string) => { await adminRefreshPhoto(id, token || undefined); refresh(); };
  return (
    <div>
      <h2>Gerenciar Produtos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <div>
          <h3>Adicionar</h3>
          <input placeholder="ID" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} />
          <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Preço" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
          <input placeholder="Avaliação" type="number" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} />
          <input placeholder="Estoque" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} />
          <input placeholder="Fornecedor ID" value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })} />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="">Selecione categoria</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div>
            <button onClick={add}>Adicionar</button>
          </div>
        </div>
        <div>
          <h3>Lista</h3>
          {list.map(p => (
            <div key={p.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 8, marginBottom: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 8, alignItems: 'center' }}>
                <img src={p.photoUrl} alt={p.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }} />
                <div>
                  <input value={p.name} onChange={e => p.name = e.target.value} />
                  <input value={p.description} onChange={e => p.description = e.target.value} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="number" value={p.price} onChange={e => p.price = Number(e.target.value)} />
                    <input type="number" value={p.rating} onChange={e => p.rating = Number(e.target.value)} />
                    <input type="number" value={p.stock} onChange={e => p.stock = Number(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button onClick={() => edit(p)}>Salvar</button>
                  <button onClick={() => setStock(p.id, Number(p.stock ?? 0))}>Atualizar estoque</button>
                  <button onClick={() => refreshPhoto(p.id)}>Atualizar foto</button>
                  <button onClick={() => remove(p.id)}>Remover</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}