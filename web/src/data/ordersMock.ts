export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  date: string;
  status: 'Pendente' | 'Em Processamento' | 'Enviado' | 'Entregue' | 'Cancelado';
  items: OrderItem[];
  total: number;
  address: string;
};

export const ordersMock: Order[] = [
  {
    id: '000123',
    date: '2025-11-12',
    status: 'Pendente',
    items: [
      { productId: 'p-sh-001', name: 'Shampoo pH Neutro', price: 39.9, qty: 1 },
      { productId: 'p-ce-010', name: 'Cera Líquida Premium', price: 59.9, qty: 1 }
    ],
    total: 99.8,
    address: 'Rua das Flores, 123 - Centro, São Paulo/SP'
  },
  {
    id: '000124',
    date: '2025-11-10',
    status: 'Enviado',
    items: [
      { productId: 'p-li-005', name: 'Limpa Vidros Pro', price: 29.9, qty: 2 },
      { productId: 'p-pa-020', name: 'Pano de Microfibra', price: 14.9, qty: 3 }
    ],
    total: 104.5,
    address: 'Av. Brasil, 456 - Jardim, Rio de Janeiro/RJ'
  },
  {
    id: '000125',
    date: '2025-11-08',
    status: 'Entregue',
    items: [
      { productId: 'p-es-002', name: 'Shampoo Espumante', price: 49.9, qty: 1 },
      { productId: 'p-ro-030', name: 'Rodo Multiuso', price: 24.9, qty: 2 }
    ],
    total: 99.7,
    address: 'Rua das Acácias, 789 - Centro, Curitiba/PR'
  }
];