import { ordersMock, Order, OrderItem } from '../data/ordersMock';

type CreateOrderInput = {
  cart: { id: string; name: string; price: number; qty: number }[];
  address: {
    nomeCompleto: string;
    telefone: string;
    rua: string; numero: string; complemento?: string;
    bairro: string; cidade: string; estado: string; cep: string;
  };
  shipping: { tipo: 'Econômico' | 'Rápido'; valor: number; prazo: string };
  payment: { metodo: 'Pix' | 'Cartão' };
  total: number;
};

export function getOrders(): Order[] {
  return ordersMock;
}

export function getOrderById(id: string): Order | undefined {
  return ordersMock.find(o => o.id === id);
}

export function createOrder(data: CreateOrderInput): Order {
  const lastId = ordersMock.length > 0 ? Number(ordersMock[ordersMock.length - 1].id) : 0;
  const nextNumeric = lastId + 1;
  const id = String(nextNumeric).padStart(6, '0');

  const items: OrderItem[] = data.cart.map(c => ({
    productId: c.id,
    name: c.name,
    price: c.price,
    qty: c.qty,
  }));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + data.shipping.valor;

  const order: Order = {
    id,
    date: new Date().toISOString().slice(0, 10),
    status: 'Pendente',
    items,
    total,
    address: `${data.address.nomeCompleto} | ${data.address.rua}, ${data.address.numero} - ${data.address.bairro}, ${data.address.cidade}/${data.address.estado} - CEP ${data.address.cep}`,
  };

  ordersMock.push(order);
  return order;
}