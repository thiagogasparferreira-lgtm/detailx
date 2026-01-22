import { useEffect, useState } from "react";
import { getProducts, Product } from "../services/api";

type FeaturedProduct = Product & { highlight?: string };

const categoryCards = [
  {
    title: "Floral",
    subtitle: "Delicadeza e frescor",
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Amadeirado",
    subtitle: "Notas intensas e sofisticadas",
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Oriental",
    subtitle: "Quente e envolvente",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Cítrico",
    subtitle: "Leve e energizante",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Gourmand",
    subtitle: "Notas adocicadas",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Chipre",
    subtitle: "Elegância clássica",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop",
  },
];

const fallbackFeatured: FeaturedProduct[] = [
  {
    id: "prf-001",
    name: "Imperial Oud",
    description: "Notas de oud, âmbar e baunilha com assinatura marcante.",
    price: 899.9,
    rating: 4.9,
    category: "Oriental",
    photoUrl:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop",
    highlight: "Eau de Parfum · 100ml",
  },
  {
    id: "prf-002",
    name: "Rose Santal",
    description: "Rosa damascena com sândalo cremoso e musk limpo.",
    price: 749.9,
    rating: 4.7,
    category: "Floral",
    photoUrl:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1200&auto=format&fit=crop",
    highlight: "Eau de Parfum · 75ml",
  },
  {
    id: "prf-003",
    name: "Citrus Riviera",
    description: "Limão siciliano, neroli e vetiver em equilíbrio refrescante.",
    price: 629.9,
    rating: 4.6,
    category: "Cítrico",
    photoUrl:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop",
    highlight: "Eau de Toilette · 100ml",
  },
  {
    id: "prf-004",
    name: "Noir Intense",
    description: "Couro, tabaco e especiarias com projeção elegante.",
    price: 989.9,
    rating: 4.8,
    category: "Amadeirado",
    photoUrl:
      "https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1200&auto=format&fit=crop",
    highlight: "Parfum · 50ml",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState<FeaturedProduct[]>([]);

  useEffect(() => {
    getProducts()
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          setFeatured(fallbackFeatured);
          return;
        }
        const mapped = data.slice(0, 4).map((item) => ({
          ...item,
          highlight: item.category ? `${item.category} · Importado` : "Importado",
        }));
        setFeatured(mapped);
      })
      .catch(() => setFeatured(fallbackFeatured));
  }, []);

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
        <div className="max-w-[1200px] mx-auto px-6 py-24 relative z-10">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-[#FF6B00]">Perfumes importados</p>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                Sofisticação em cada nota.
              </h1>
              <p className="mt-5 text-lg text-gray-300 max-w-xl">
                Curadoria de fragrâncias exclusivas para quem busca presença, elegância e longa fixação.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/produtos"
                  className="inline-flex items-center justify-center bg-[#FF6B00] text-black px-6 py-3 rounded-full font-semibold shadow-[0_10px_30px_rgba(255,107,0,0.18)] hover:brightness-95 transition"
                >
                  Ver catálogo
                </a>
                <a
                  href="/produtos"
                  className="inline-flex items-center justify-center border border-white/20 px-6 py-3 rounded-full font-semibold text-white hover:border-[#FF6B00] transition"
                >
                  Perfis olfativos
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -right-4 w-28 h-28 rounded-full bg-[#FF6B00]/20 blur-2xl" />
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1600&auto=format&fit=crop"
                  alt="Frascos de perfume"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1600&auto=format&fit=crop";
                  }}
                />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {["Entrega rápida", "100% originais", "Curadoria premium", "Pagamento seguro"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-medium text-white">Encontre seu perfil olfativo</h2>
          <p className="text-gray-400 mt-2">
            Seleções rápidas para descobrir sua próxima assinatura.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {categoryCards.map((card) => (
            <article
              key={card.title}
              className="group bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 transition hover:border-[#FF6B00]"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1200&auto=format&fit=crop";
                  }}
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{card.subtitle}</p>
                <a
                  href={`/produtos?search=${encodeURIComponent(card.title)}`}
                  className="mt-4 inline-flex text-sm font-semibold text-[#FF6B00]"
                >
                  Explorar
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-medium">Destaques da semana</h3>
          <a href="/produtos" className="text-sm text-[#FF6B00] font-medium">
            Ver todos
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <article
              key={p.id}
              className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5"
            >
              <div className="relative h-56 bg-black/40">
                <img
                  src={p.photoUrl || `/product-images/${p.id}.jpg`}
                  alt={p.name}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1200&auto=format&fit=crop";
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/60 text-xs px-2 py-1 rounded text-white/80">
                  {p.highlight || "Eau de Parfum"}
                </div>
              </div>

              <div className="p-5">
                <h4 className="text-lg font-medium">{p.name}</h4>
                <p className="text-sm text-gray-400 mt-2">{p.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xl font-semibold text-[#FF6B00]">
                    R$ {Number(p.price).toFixed(2)}
                  </div>
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

      <section className="bg-gradient-to-r from-[#0F0F0F] to-[#111111] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-medium">Consultoria personalizada</h3>
            <p className="text-gray-400 mt-2">
              Precisa de ajuda para escolher? Nossa equipe indica o perfume ideal para o seu estilo.
            </p>
          </div>
          <div>
            <a
              href="/produtos"
              className="inline-block bg-[#FF6B00] text-black px-6 py-3 rounded-full font-semibold"
            >
              Falar com especialista
            </a>
          </div>
        </div>
      </section>

      <footer className="mt-12 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 py-8 text-gray-400">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="text-white font-semibold text-lg">Aroma Importados</div>
              <div className="mt-2 text-sm">Perfumes originais, entrega rápida e atendimento premium.</div>
            </div>

            <div className="text-sm">
              <div>Contato: atendimento@aromaimportados.com</div>
              <div>WhatsApp: (11) 99999-9999</div>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            © {new Date().getFullYear()} Aroma Importados. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
