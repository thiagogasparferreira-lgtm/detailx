// server/payments.mjs
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

type OrderItem = { id: string; name: string; description?: string; qty: number; price: number };
type Order = { id: string; customer: unknown; items: OrderItem[]; shipping: number; subtotal: number; total: number; status: string; createdAt: string; payment: unknown; paidAt?: string };
type OrdersMap = Record<string, Order>;
type PreferenceCreateResponse = { id: string; init_point?: string; sandbox_init_point?: string };
type PaymentGetResponse = { external_reference?: string; status?: string };

const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || "" });

// Simples "DB" em memória — substitua por seu banco real
const ordersFile = path.join(__dirname, "data", "orders.json");
const productsFile = path.join(__dirname, "data", "products.json");
const suppliersFile = path.join(__dirname, "data", "suppliers.json");
const readOrders = (): OrdersMap => {
  try {
    return JSON.parse(fs.readFileSync(ordersFile, "utf8"));
  } catch {
    return {} as OrdersMap;
  }
};
const saveOrders = (orders: OrdersMap) => fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

function readProducts(): any[] {
  try {
    return JSON.parse(fs.readFileSync(productsFile, "utf8"));
  } catch {
    return [];
  }
}

// Catálogo
app.get('/categories', (_req, res) => {
  const products = readProducts();
  const cats = Array.from(new Set(products.map((p: any) => p.category))).filter(Boolean);
  res.json(cats);
});

app.get('/products', (req, res) => {
  const products = readProducts();
  const { category } = req.query as { category?: string };
  const list = category ? products.filter((p: any) => p.category === category) : products;
  res.json(list);
});

app.get('/products/:id', (req, res) => {
  const products = readProducts();
  const item = products.find((p: any) => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(item);
});

/**
 * POST /api/orders
 * Body: { customer: {name,email,phone,address}, items: [{id,name,qty,price}], shipping }
 * Retorna: { orderId, total }
 */
app.post("/api/orders", (req, res) => {
  const { customer = {}, items = [], shipping = 0 } = req.body;
  if (!items.length) return res.status(400).json({ error: "No items" });

  const orders = readOrders();
  const orderId = `ord_${Date.now()}`;
  const subtotal = items.reduce((s: number, it: OrderItem) => s + it.price * it.qty, 0);
  const total = Number((subtotal + (shipping || 0)).toFixed(2));

  const order = {
    id: orderId,
    customer,
    items,
    shipping,
    subtotal,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
    payment: null
  };

  orders[orderId] = order;
  saveOrders(orders);

  res.json({ orderId, total });
});

app.post("/orders", (req, res) => {
  const { customer = {}, items = [], shipping = 0 } = req.body;
  if (!items.length) return res.status(400).json({ error: "No items" });
  const orders = readOrders();
  const orderId = `ord_${Date.now()}`;
  const subtotal = items.reduce((s: number, it: OrderItem) => s + it.price * it.qty, 0);
  const total = Number((subtotal + (shipping || 0)).toFixed(2));
  const order = { id: orderId, customer, items, shipping, subtotal, total, status: "pending", createdAt: new Date().toISOString(), payment: null };
  orders[orderId] = order;
  saveOrders(orders);
  res.json({ id: orderId, total });
});

/**
 * POST /api/payments/create
 * Body: { orderId, method }  // method optional
 * Retorna: { init_point, preferenceId } (usar init_point para redirecionar o usuário)
 */
app.post("/api/payments/create", async (req, res) => {
  try {
    const { orderId, produtos, nome, email } = req.body as any;
    const orders = readOrders();
    let currentOrderId = orderId as string | undefined;
    let order: Order | undefined = currentOrderId ? orders[currentOrderId] : undefined;

    if (!order && Array.isArray(produtos) && produtos.length > 0) {
      currentOrderId = `ord_${Date.now()}`;
      const items: OrderItem[] = produtos.map((p: any, idx: number) => ({
        id: String(p.id || p.sku || p.nome || `item_${idx}`),
        name: String(p.nome || p.title || `Item ${idx + 1}`),
        qty: Number(p.quantidade || p.qty || 1),
        price: Number(p.preco || p.price || 0)
      }));
      const subtotal = items.reduce((s: number, it: OrderItem) => s + it.price * it.qty, 0);
      const total = Number(subtotal.toFixed(2));
      order = {
        id: currentOrderId!,
        customer: { nome: nome, email },
        items,
        shipping: 0,
        subtotal,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
        payment: null
      };
      orders[currentOrderId!] = order;
      saveOrders(orders);
    }

    if (!order) return res.status(404).json({ error: "order not found" });

    // Monta items para Preference
    const mpItems = order.items.map((it: OrderItem) => ({
      id: it.id,
      title: it.name,
      description: it.description || "",
      quantity: it.qty,
      currency_id: "BRL",
      unit_price: Number(it.price)
    }));

    const preference = {
      items: mpItems,
      payer: {
        name: (order.customer as any)?.name || (order.customer as any)?.nome || nome || "",
        email: (order.customer as any)?.email || email || ""
      },
      external_reference: currentOrderId!,
      back_urls: {
        success: `${process.env.APP_URL}/pedido/confirmacao/${currentOrderId}`,
        failure: `${process.env.APP_URL}/checkout`,
        pending: `${process.env.APP_URL}/pedido/confirmacao/${currentOrderId}`
      },
      auto_return: "approved", // redireciona após pagamento aprovado
      notification_url: `${process.env.SERVER_URL || "http://localhost:8080"}/api/payments/webhook`
    };

    const pref = new Preference(mpClient);
    const mpRes = await pref.create({ body: preference });

    // Salva referência no pedido
    const pr = mpRes as PreferenceCreateResponse;
    order.payment = {
      preferenceId: pr.id,
      init_point: pr.init_point,
      sandbox_init_point: pr.sandbox_init_point || null,
      status: "preference_created"
    };
    orders[currentOrderId!] = order;
    saveOrders(orders);

    const pr2 = mpRes as PreferenceCreateResponse;
    res.json({
      init_point: pr2.init_point,
      sandbox_init_point: pr2.sandbox_init_point,
      preferenceId: pr2.id
    });
  } catch {
    res.status(500).json({ error: "create payment failed" });
  }
});

app.post("/mercadopago/create", async (req, res) => {
  try {
    const { orderId, produtos, nome, email } = req.body as any;
    const orders = readOrders();
    let currentOrderId = orderId as string | undefined;
    let order: Order | undefined = currentOrderId ? orders[currentOrderId] : undefined;

    if (!order && Array.isArray(produtos) && produtos.length > 0) {
      currentOrderId = `ord_${Date.now()}`;
      const items: OrderItem[] = produtos.map((p: any, idx: number) => ({
        id: String(p.id || p.sku || p.nome || `item_${idx}`),
        name: String(p.nome || p.title || `Item ${idx + 1}`),
        qty: Number(p.quantidade || p.qty || 1),
        price: Number(p.preco || p.price || 0)
      }));
      const subtotal = items.reduce((s: number, it: OrderItem) => s + it.price * it.qty, 0);
      const total = Number(subtotal.toFixed(2));
      order = {
        id: currentOrderId!,
        customer: { nome: nome, email },
        items,
        shipping: 0,
        subtotal,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
        payment: null
      };
      orders[currentOrderId!] = order;
      saveOrders(orders);
    }

    if (!order) return res.status(404).json({ error: "order not found" });

    const mpItems = order.items.map((it: OrderItem) => ({
      id: it.id,
      title: it.name,
      description: it.description || "",
      quantity: it.qty,
      currency_id: "BRL",
      unit_price: Number(it.price)
    }));

    const preference = {
      items: mpItems,
      payer: {
        name: (order.customer as any)?.name || (order.customer as any)?.nome || nome || "",
        email: (order.customer as any)?.email || email || ""
      },
      external_reference: currentOrderId!,
      back_urls: {
        success: `${process.env.APP_URL}/pedido/confirmacao/${currentOrderId}`,
        failure: `${process.env.APP_URL}/checkout`,
        pending: `${process.env.APP_URL}/pedido/confirmacao/${currentOrderId}`
      },
      auto_return: "approved",
      notification_url: `${process.env.SERVER_URL || "http://localhost:8080"}/api/payments/webhook`
    };

    const pref = new Preference(mpClient);
    const mpRes = await pref.create({ body: preference });
    const pr = mpRes as PreferenceCreateResponse;
    order.payment = {
      preferenceId: pr.id,
      init_point: pr.init_point,
      sandbox_init_point: pr.sandbox_init_point || null,
      status: "preference_created"
    };
    orders[currentOrderId!] = order;
    saveOrders(orders);

    const pr2 = mpRes as PreferenceCreateResponse;
    res.json({ init_point: pr2.init_point, sandbox_init_point: pr2.sandbox_init_point, preferenceId: pr2.id });
  } catch {
    res.status(500).json({ error: "create payment failed" });
  }
});

app.post("/api/payments/mercadopago/create", async (req, res) => {
  try {
    const { orderId, produtos, nome, email } = req.body as any;
    const orders = readOrders();
    let currentOrderId = orderId as string | undefined;
    let order: Order | undefined = currentOrderId ? orders[currentOrderId] : undefined;

    if (!order && Array.isArray(produtos) && produtos.length > 0) {
      currentOrderId = `ord_${Date.now()}`;
      const items: OrderItem[] = produtos.map((p: any, idx: number) => ({
        id: String(p.id || p.sku || p.nome || `item_${idx}`),
        name: String(p.nome || p.title || `Item ${idx + 1}`),
        qty: Number(p.quantidade || p.qty || 1),
        price: Number(p.preco || p.price || 0)
      }));
      const subtotal = items.reduce((s: number, it: OrderItem) => s + it.price * it.qty, 0);
      const total = Number(subtotal.toFixed(2));
      order = {
        id: currentOrderId!,
        customer: { nome: nome, email },
        items,
        shipping: 0,
        subtotal,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
        payment: null
      };
      orders[currentOrderId!] = order;
      saveOrders(orders);
    }

    if (!order) return res.status(404).json({ error: "order not found" });

    const mpItems = order.items.map((it: OrderItem) => ({
      id: it.id,
      title: it.name,
      description: it.description || "",
      quantity: it.qty,
      currency_id: "BRL",
      unit_price: Number(it.price)
    }));

    const preference = {
      items: mpItems,
      payer: {
        name: (order.customer as any)?.name || (order.customer as any)?.nome || nome || "",
        email: (order.customer as any)?.email || email || ""
      },
      external_reference: currentOrderId!,
      back_urls: {
        success: `${process.env.APP_URL}/pedido/confirmacao/${currentOrderId}`,
        failure: `${process.env.APP_URL}/checkout`,
        pending: `${process.env.APP_URL}/pedido/confirmacao/${currentOrderId}`
      },
      auto_return: "approved",
      notification_url: `${process.env.SERVER_URL || "http://localhost:8080"}/api/payments/webhook`
    };

    const pref = new Preference(mpClient);
    const mpRes = await pref.create({ body: preference });
    const pr = mpRes as PreferenceCreateResponse;
    order.payment = {
      preferenceId: pr.id,
      init_point: pr.init_point,
      sandbox_init_point: pr.sandbox_init_point || null,
      status: "preference_created"
    };
    orders[currentOrderId!] = order;
    saveOrders(orders);

    const pr2 = mpRes as PreferenceCreateResponse;
    res.json({ init_point: pr2.init_point, sandbox_init_point: pr2.sandbox_init_point, preferenceId: pr2.id });
  } catch {
    res.status(500).json({ error: "create payment failed" });
  }
});

/**
 * POST /api/payments/webhook
 * Mercado Pago envia notifications para essa rota. Aqui consultamos o pagamento e atualizamos o pedido.
 */
app.post("/api/payments/webhook", async (req, res) => {
  try {
    const { id } = req.query as { id?: string };
    res.status(200).send("OK");
    if (!id) return;
    const paymentApi = new Payment(mpClient);
    const mpPayment = await paymentApi.get({ id: String(id) }).catch(() => null);
    if (!mpPayment) return;
    const paymentInfo = mpPayment as PaymentGetResponse;
    const externalRef = paymentInfo.external_reference || null;
    if (!externalRef) return;
    const orders = readOrders();
    const order = orders[externalRef];
    if (!order) return;
    const status = String(paymentInfo.status || "").toLowerCase();
    if (status.includes("approved") || status === "paid") {
      order.status = "paid";
      order.paidAt = new Date().toISOString();
    } else if (status.includes("pending")) {
      order.status = "pending";
    } else if (status.includes("cancelled") || status.includes("charged_back") || status.includes("refunded") || status.includes("rejected")) {
      order.status = "failed";
    }
    orders[externalRef] = order;
    saveOrders(orders);
  } catch {
    return;
  }
});

app.get("/api/orders/:id", (req, res) => {
  const orders = readOrders();
  const order = orders[req.params.id];
  if (!order) return res.status(404).json({ error: "not found" });
  res.json(order);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server payments running on port ${port}`));

