import { useEffect, useState } from 'react';
import { getCategories, getProducts, Product } from '../services/api';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

// usando o tipo Product do serviço para manter contrato consistente

export default function Produtos() {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [list, setList] = useState<Product[]>([]);
  const { add } = useCart();

  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    (async () => {
      const cats = await getCategories();
      setCategories(Array.isArray(cats) ? cats.map(String) : []);
    })();
  }, []);

  useEffect(() => {
    getProducts(selectedCategory || undefined).then((products) => {
      let filtered = products;

      if (searchTerm) {
        filtered = products.filter((p: Product) =>
          (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setList(filtered);
    });
  }, [selectedCategory, searchTerm]);

  const getProductImage = (p: Product) => {
    if (p.photoUrl) return p.photoUrl;

    const nameFile = (p.name || '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '') + '.jpg';

    return `/product-images/${p.id}.jpg` || `/product-images/${nameFile}` || '/product-images/default.jpg';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', color: 'var(--dx-text)' }}>

      {searchTerm && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--dx-text)' }}>Resultados da busca: "{searchTerm}"</h2>
          <p style={{ color: 'rgba(229,229,229,0.65)' }}>{list.length} produto(s) encontrado(s)</p>
        </div>
      )}

      {!searchTerm && (
        <>
          <h2 style={{ fontSize: '28px', marginBottom: '24px', color: 'var(--dx-text)' }}>Produtos</h2>

          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('')}
              style={{
                fontWeight: selectedCategory === '' ? 700 : 500,
                padding: '8px 16px',
                border: selectedCategory === '' ? '1px solid #FF6B00' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: '20px',
                backgroundColor: selectedCategory === '' ? '#FF6B00' : 'var(--dx-surface)',
                color: selectedCategory === '' ? '#0F0F0F' : 'var(--dx-text)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Todos
            </button>

            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                style={{
                  fontWeight: selectedCategory === c ? 700 : 500,
                  padding: '8px 16px',
                  border: selectedCategory === c ? '1px solid #FF6B00' : '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '20px',
                  backgroundColor: selectedCategory === c ? '#FF6B00' : 'var(--dx-surface)',
                  color: selectedCategory === c ? '#0F0F0F' : 'var(--dx-text)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
        {list.map((p: Product) => (
          <div
            key={p.id}
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              padding: '16px',
              backgroundColor: 'var(--dx-surface)',
              boxShadow: 'var(--dx-shadow)',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,107,0,0.25)';
              e.currentTarget.style.borderColor = '#FF6B00';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--dx-shadow)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
            }}
          >
            <img
              src={getProductImage(p)}
              onError={(e) => (e.currentTarget.src = '/product-images/default.jpg')}
              alt={p.name}
              style={{
                width: '100%',
                height: '240px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '12px'
              }}
            />

            <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '8px', color: 'var(--dx-text)' }}>
              {p.name}
            </div>

            <div style={{ color: 'rgba(229,229,229,0.70)', fontSize: '14px', marginBottom: '12px' }}>
              {p.description}
            </div>

            <div style={{ fontSize: '20px', fontWeight: 700, color: '#FF6B00', marginBottom: '16px' }}>
              R$ {p.price.toFixed(2)}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Link
                to={`/produto/${p.id}`}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  color: 'var(--dx-text)',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FF6B00';
                  e.currentTarget.style.color = '#FF6B00';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.color = 'var(--dx-text)';
                }}
              >
                Ver Detalhes
              </Link>

              <button
                onClick={() => add(p)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#FF6B00',
                  color: '#0F0F0F',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(229,229,229,0.65)' }}>
          <h3>Nenhum produto encontrado</h3>
          <p>Tente ajustar sua busca ou categoria.</p>
        </div>
      )}
    </div>
  );
}
