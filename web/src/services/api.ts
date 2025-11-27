// API compatível com o backend novo DetailX

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  rating?: number;
  stock?: number;
  supplierId?: string;
  category?: string;
  photoUrl?: string;
};

export type Supplier = { id: string; name: string; contact?: string; status?: string };
export type OrderItem = { id: string; name?: string; qty: number; price: number };
export type Order = { id: string; status: string; items: OrderItem[]; total?: number };

const BASE = ((import.meta as unknown as { env?: { VITE_SERVER_URL?: string } }).env?.VITE_SERVER_URL) || 'http://localhost:5176';

/* ===========================
   PRODUTOS
=========================== */

// GET todos os produtos
export async function getProducts(category?: string): Promise<Product[]> {
  const r = await fetch(`${BASE}/products`);
  const products = await r.json();

  if (category) {
    return (products as Product[]).filter((p) => (p.category || "").toLowerCase() === category.toLowerCase());
  }

  return products as Product[];
}

// GET produto por ID (backend não tem /products/:id)
export async function getProduct(id: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.id === id) || null;
}

/* ===========================
   CATEGORIAS
=========================== */

export async function getCategories(): Promise<string[]> {
  const products = await getProducts();
  const cats = [...new Set(products.map((p) => p.category || "Outros"))];
  return cats;
}

/* ===========================
   ADMIN LOGIN
=========================== */

export async function loginAdmin(email: string, senha: string): Promise<{ token?: string }> {
  const r = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });
  return r.json();
}

/* ===========================
   SUPPLIERS
=========================== */

export async function getSuppliers(): Promise<Supplier[]> {
  const r = await fetch(`${BASE}/suppliers`);
  return r.json();
}

/* ===========================
   PAGAMENTO + PEDIDO
=========================== */

type CreatePaymentPayload = { items: { id: string; title: string; quantity: number; unit_price: number }[]; shipping?: { value: number } };

// Cria pagamento (e o pedido junto)
export async function createOrder(payload: CreatePaymentPayload) {
  const r = await fetch(`${BASE}/api/payments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return r.json();
}

// Alias compatível com telas que usam createPayment
export async function createPayment(payload: CreatePaymentPayload) {
  return createOrder(payload);
}

// Pega pedido após pagamento (confirmacao)
export async function getOrder(id: string) {
  const r = await fetch(`${BASE}/api/orders/${id}`);
  return r.json();
}

/* ===========================
   ADMIN CRUD PRODUTOS
=========================== */

export async function adminAddProduct(p: Product, token: string) {
  const r = await fetch(`${BASE}/api/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(p)
  });
  return r.json();
}

export async function adminUpdateProduct(id: string, p: Product, token: string) {
  const r = await fetch(`${BASE}/api/admin/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(p)
  });
  return r.json();
}

export async function adminDeleteProduct(id: string, token: string) {
  const r = await fetch(`${BASE}/api/admin/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return r.json();
}

export async function adminUpdateStock(id: string, stock: number, token?: string) {
  try {
    const r = await fetch(`${BASE}/api/admin/products/${id}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ stock })
    });
    if (!r.ok) throw new Error('no endpoint');
    return r.json();
  } catch {
    const r2 = await fetch(`${BASE}/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ stock })
    });
    return r2.json();
  }
}

export async function adminRefreshPhoto(id: string, token?: string) {
  try {
    const r = await fetch(`${BASE}/api/admin/products/${id}/photo`, {
      method: 'PATCH',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    if (!r.ok) throw new Error('no endpoint');
    return r.json();
  } catch {
    return { id, refreshed: true };
  }
}

/* ===========================
   ADMIN PEDIDOS
=========================== */

export async function adminListOrders(token: string): Promise<Order[]> {
  const r = await fetch(`${BASE}/api/admin/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return r.json();
}

export async function adminGetOrder(id: string, token: string): Promise<Order> {
  const r = await fetch(`${BASE}/api/admin/orders/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return r.json();
}

export async function listOrders(): Promise<Order[]> {
  try {
    const r = await fetch(`${BASE}/api/admin/orders`);
    if (!r.ok) throw new Error('no endpoint');
    return r.json();
  } catch {
    return [];
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<Order | { id: string; status: string }> {
  try {
    const r = await fetch(`${BASE}/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!r.ok) throw new Error('no endpoint');
    return r.json();
  } catch {
    return { id, status };
  }
}

// Métricas do admin (fallback client-side)
export async function adminMetrics(): Promise<{ totalProducts: number; totalSales: number; totalOrders: number; totalRevenue: number; lowStockProducts: Product[]; salesByDay: Record<string, number> }> {
  const products = await getProducts();
  const totalProducts = products.length;
  const totalSales = 0;
  const totalOrders = 0;
  const totalRevenue = 0;
  const lowStockProducts = products.filter((p) => Number(p.stock ?? 0) <= 5);
  const days = 7;
  const salesByDay: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    salesByDay[key] = 0;
  }
  return { totalProducts, totalSales, totalOrders, totalRevenue, lowStockProducts, salesByDay };
}

