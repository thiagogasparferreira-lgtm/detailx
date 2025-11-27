# detailX — Estrutura e Execução

## Estrutura
- `server/` — backend Express + Mercado Pago
  - `index.js` — rotas (`/suppliers`, `/products`, `/api/payments/*`)
  - `package.json` — scripts (`start`, `dev`), ESM (`type": "module"`)
  - `.env.example` — variáveis obrigatórias (sem valores reais)
  - `db/` — armazenamento em arquivos
    - `products.json` — catálogo de produtos
    - `suppliers.json` — fornecedores
    - `orders.json` — pedidos
- `web/` — frontend Vite/React
  - `.env` — `VITE_SERVER_URL` apontando para o backend

## Variáveis de ambiente
Copie `server/.env.example` para `server/.env` e preencha:
```
PORT=5176
SERVER_URL=http://localhost:5176
FRONT_URL=http://localhost:5175
MP_ACCESS_TOKEN=<seu_token_sandbox>
```

No front (`web/.env`):
```
VITE_SERVER_URL=http://localhost:5176
```

## Executando
1. Backend: `cd server && npm install && npm run dev`
2. Frontend (raiz): `npm install && npm run dev`
   - Vite abrirá em `http://localhost:5175/`

## Testes rápidos
- `http://localhost:5176/suppliers` → JSON de fornecedores
- `http://localhost:5176/products` → JSON de produtos
- Checkout: finalize compra e redirecione para Mercado Pago

## Pagamentos
- Criação de preferência: `POST /api/payments/create`
- Webhook: `POST /api/payments/webhook` (atualiza `orders.json`)
- Consulta pedido: `GET /api/orders/:id`

## Observações
- Não commitar segredos. Use `.env` local e compartilhe apenas `.env.example`.
- Em produção, usar URL pública em `SERVER_URL` (ngrok ou domínio) para receber webhooks.