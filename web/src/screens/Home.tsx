import { useEffect, useState } from "react";

// Home.tsx - CarPro inspired layout for DetailX
// Paste this file into: web/src/screens/Home.tsx
// Requires Tailwind CSS configured in your project (recommended). Uses the palette: black/antracite + #FF6B00

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
};

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  const categoryImages: Record<string, string> = {
    'Shampoo automotivo': '/product-images/p-sh-001.jpg',
    'Cera': '/product-images/p-ce-001.jpg',
    'Hidratante de couro': '/product-images/p-cu-001.jpg',
    'Limpadores': '/product-images/p-li-001.jpg',
    'Polidores': '/product-images/p-po-001.jpg',
    'Rodas': '/product-images/p-ro-001.jpg',
    'Acessórios': '/product-images/p-ac-001.jpg',
    'Kits': '/product-images/p-sh-003.jpg',
  };

  useEffect(() => {
    // Try to fetch products from the app's endpoint. Adjust path if needed.
    fetch("/produtos")
      .then((r) => r.json())
      .then((data) => {
        const list: Product[] = Array.isArray(data) ? data : data.products || [];
        setFeatured(list.slice(0, 4));
      })
      .catch(() => {
        // silent fallback: small demo set to avoid blank UI during dev
        const demo: Product[] = [
          { id: "p-sh-001", name: "Shampoo pH Neutro", price: 49.9, description: "Limpeza suave sem remover proteção", image: "/product-images/p-sh-001.jpg" },
          { id: "p-sh-003", name: "Shampoo Concentrado", price: 69.9, description: "Rendimento superior para uso profissional", image: "/product-images/p-sh-003.jpg" },
        ];
        setFeatured(demo);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-60 pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 py-28 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight">
                DetailX
              </h1>
              <p className="mt-4 text-lg text-gray-300 max-w-xl">
                Precisão técnica. Brilho impecável.
              </p>
              <div className="mt-8">
                <a
                  href="/produtos"
                  className="inline-block bg-[#FF6B00] text-black px-6 py-3 rounded-full font-semibold shadow-[0_10px_30px_rgba(255,107,0,0.18)] hover:brightness-95 transition"
                >
                  Explorar Produtos
                </a>
              </div>
            </div>

            <div className="flex-1 hidden lg:block">
              {/* Hero image placeholder - use real image or keep decorative */}
              <div className="w-full h-72 rounded-lg overflow-hidden border border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1400&auto=format&fit=crop"
                  alt="car hero"
                  className="w-full h-full object-cover object-center brightness-90"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/product-images/p-sh-001.jpg'; }}
                />
              </div>
              </div>
          </div>
        </div>
        {/* Decorative bottom border */}
        <div className="h-8 bg-gradient-to-b from-transparent to-[#0F0F0F]" />
      </section>

      {/* CATEGORIES */}
      <section className="max-w-[1400px] mx-auto px-6 py-12">
        <h2 className="text-3xl font-medium text-center text-white">Explore por categorias</h2>
        <p className="text-center text-gray-400 mt-2 mb-6">Encontre rapidamente o que você precisa</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          {[
            "Shampoo automotivo",
            "Cera",
            "Hidratante de couro",
            "Limpadores",
            "Polidores",
            "Rodas",
            "Acessórios",
            "Kits",
          ].map((c) => (
            <button
              key={c}
              className="flex flex-col items-center gap-3 p-4 bg-[#1A1A1A] rounded-xl border border-white/5 hover:border-[#FF6B00] transition shadow-sm"
            >
              <div className="w-20 h-20 rounded-md overflow-hidden border border-white/10 bg-black/30">
                <img 
                  src={categoryImages[c] || '/product-images/p-sh-001.jpg'} 
                  alt={c}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/product-images/p-sh-001.jpg'; }}
                />
              </div>
              <span className="text-sm text-white text-center">{c}</span>
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS / FEATURED */}
      <section className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-medium">Produtos em Destaque</h3>
          <a href="/produtos" className="text-sm text-[#FF6B00] font-medium">Ver todos</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <article key={p.id} className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5">
              <div className="relative h-56 bg-black/40">
                <img
                  src={p.image || `/product-images/${p.id}.jpg`}
                  alt={p.name}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "/product-images/default.jpg";
                  }}
                  className="w-full h-full object-contain p-6 bg-white/2"
                />
                <div className="absolute top-3 left-3 bg-black/40 text-xs px-2 py-1 rounded text-white/80">{p.id}</div>
              </div>

              <div className="p-5">
                <h4 className="text-lg font-medium">{p.name}</h4>
                <p className="text-sm text-gray-400 mt-2">{p.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xl font-semibold text-[#FF6B00]">R$ {Number(p.price).toFixed(2)}</div>
                  <a
                    href={`/produto/${p.id}`}
                    className="inline-flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full text-sm hover:border-[#FF6B00] transition"
                  >
                    Ver detalhes
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TECHNOLOGY / CTA */}
      <section className="bg-gradient-to-r from-[#0F0F0F] to-[#111111] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-medium">Tecnologia e proteção</h3>
            <p className="text-gray-400 mt-2">Produtos formulados para máxima durabilidade e brilho.</p>
          </div>
          <div>
            <a href="/produtos" className="inline-block bg-[#FF6B00] text-black px-6 py-3 rounded-full font-semibold">Ver catálogo</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-12 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-8 text-gray-400">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <div className="text-white font-semibold text-lg">DetailX</div>
              <div className="mt-2 text-sm">Produtos automotivos de alta performance.</div>
            </div>

            <div className="mt-6 md:mt-0 text-sm">
              <div>Contato: contato@detailx.com</div>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500">© {new Date().getFullYear()} DetailX. Todos os direitos reservados.</div>
        </div>
      </footer>
    </main>
  );
}

