import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { readFile, writeFile } from "fs/promises";

const suppliersFile = new URL("./db/suppliers.json", import.meta.url);
const productsFile = new URL("./db/products.json", import.meta.url);
const ordersFile = new URL("./db/orders.json", import.meta.url);

dotenv.config();
const PORT = process.env.PORT || 5176;

const app = express();
app.use(cors());
app.use(express.json());

async function readJSON(fileUrl, fallback) {
  try {
    const buf = await readFile(fileUrl);
    return JSON.parse(buf.toString());
  } catch {
    return fallback;
  }
}

async function writeJSON(fileUrl, data) {
  const json = JSON.stringify(data, null, 2);
  await writeFile(fileUrl, json);
}

app.get("/suppliers", async (req, res) => {
  const data = await readJSON(suppliersFile, []);
  res.json(data);
});

app.get("/products", async (req, res) => {
  const data = await readJSON(productsFile, []);
  res.json(
    data.map((p) => ({
      id: p.id,
      name: p.title,
      description: p.description || "",
      price: p.price,
      currency: p.currency || "BRL",
      stock: p.stock ?? 0,
      supplierId: p.supplierId || "",
      photoUrl: p.image || "",
    }))
  );
});

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

app.post("/api/payments/create", async (req, res) => {
  try {
    const { items } = req.body || {};
    const preference = await new Preference(client).create({
      body: {
        items,
        back_urls: {
          success: `${process.env.FRONT_URL}/pedido/confirmacao`,
          failure: `${process.env.FRONT_URL}/pedido/erro`,
        },
        auto_return: "approved",
        notification_url: `${process.env.SERVER_URL}/api/payments/webhook`,
      },
    });
    res.json({ init_point: preference.init_point, id: preference.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar preferência" });
  }
});

app.post("/api/payments/webhook", async (req, res) => {
  try {
    const data = req.body || {};
    const topic = data.type || data.action;
    if (topic !== "payment") return res.status(200).send("Ignorado: não é pagamento");
    const paymentId = data?.data?.id || req.query["data.id"] || req.query.id;
    if (!paymentId) return res.status(400).send("Sem ID do pagamento");

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    });
    const payment = await mpRes.json();
    const orderId = payment.external_reference;
    const status = payment.status;

    let newStatus = "pending";
    if (status === "approved") newStatus = "paid";
    if (status === "cancelled") newStatus = "cancelled";
    if (status === "rejected") newStatus = "failed";

    const orders = await readJSON(ordersFile, []);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx >= 0) {
      orders[idx].status = newStatus;
      await writeJSON(ordersFile, orders);
    }
    return res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Erro no webhook:", err);
    return res.status(500).send("erro");
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`DetailX server running on port ${PORT}`));
