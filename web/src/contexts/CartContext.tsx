import { createContext, useContext, useMemo, useState } from 'react';
import { getProductImage } from '../utils/images';

type CartItem = { id: string; name: string; price: number; photoUrl?: string; qty: number };
type ProductInput = { id: string; name: string; price: number; photoUrl?: string; imagem?: string };
type CartContextValue = {
  items: CartItem[];
  add: (p: ProductInput, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  totalQty: () => number;
};

const Ctx = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (p: ProductInput, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === p.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx].qty += qty;
        return next;
      }
      return [
        ...prev,
        { id: p.id, name: p.name, price: p.price, photoUrl: p.photoUrl || p.imagem || getProductImage(p.name), qty }
      ];
    });
  };

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const setQty = (id: string, qty: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
  const clear = () => setItems([]);

  const totalValue = useMemo(() => items.reduce((a, i) => a + i.price * i.qty, 0), [items]);
  const totalQtyValue = useMemo(() => items.reduce((a, i) => a + i.qty, 0), [items]);

  const value: CartContextValue = {
    items,
    add,
    remove,
    setQty,
    clear,
    total: () => totalValue,
    totalQty: () => totalQtyValue,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() { return useContext(Ctx)!; }