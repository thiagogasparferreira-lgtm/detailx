import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct, Product } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/useToast';
import StarRating from '../components/StarRating';

const mockReviews = [
  { id: 1, userName: 'Carlos Silva', rating: 5, comment: 'Fixação excelente e projeção na medida certa.', date: '2024-01-15' },
  { id: 2, userName: 'Maria Santos', rating: 4, comment: 'Chegou rápido e o aroma é sofisticado, gostei muito.', date: '2024-01-10' },
  { id: 3, userName: 'João Oliveira', rating: 5, comment: 'Fragrância marcante, virou meu perfume assinatura.', date: '2024-01-08' }
];

export default function DetalhesProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { add } = useCart();
  const { showToast, ToastContainer } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // --- CORREÇÃO PRINCIPAL --- //
  useEffect(() => { 
    if (!id) return;

    setLoading(true);

    getProduct(id)
      .then((data) => {
        if (!data) {
          setP(null);
          return;
        }
        setP(data);
      })
      .catch((error) => {
        console.error('Erro ao carregar produto:', error);
        showToast('Erro ao carregar produto', 'error');
      })
      .finally(() => setLoading(false));
  }, [id, showToast]);

  const handleAddToCart = () => {
    if (!p || quantity < 1 || isAddingToCart) return;

    setIsAddingToCart(true);
    add(p, quantity);
    showToast('Produto adicionado ao carrinho!', 'success');

    setTimeout(() => {
      setQuantity(1);
      setIsAddingToCart(false);
    }, 1000);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(p?.stock || 1, prev + delta)));
  };

  // --- NOVO SISTEMA DE IMAGENS (compatível com backend) --- //
  const getProductImages = (product: Product) => {
    if (product?.photoUrl) return [product.photoUrl];
    return ['/product-images/default.jpg'];
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', fontSize: '18px', color: '#6B7280' }}>
        Carregando produto...
      </div>
    );
  }

  if (!p) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--dx-text)', backgroundColor: 'var(--dx-bg)', minHeight: '100vh' }}>
        <h2>Produto não encontrado</h2>
        <p style={{ color: 'rgba(229,229,229,0.75)' }}>O produto solicitado não está disponível.</p>

        <Link 
          to="/produtos"
          style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#FF6B00',
            color: '#0F0F0F',
            borderRadius: '8px',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          Voltar para Produtos
        </Link>
      </div>
    );
  }

  const productImages = getProductImages(p);
  const profile = p.category || 'Assinatura importada';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', backgroundColor: 'var(--dx-bg)', color: 'var(--dx-text)', minHeight: '100vh' }}>
      <ToastContainer />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '24px' }}>
        <Link to="/" style={{ color: 'rgba(229,229,229,0.75)' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <Link to="/produtos" style={{ color: 'rgba(229,229,229,0.75)' }}>Produtos</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ fontWeight: 600 }}>{p.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px' }}>

        {/* Coluna Imagem */}
        <div>
          <div style={{ backgroundColor: 'var(--dx-surface)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: productImages.length > 1 ? '24px' : '0' }}>
            <img 
              src={productImages[selectedImage]} 
              alt={p.name}
              onError={(e) => e.currentTarget.src = '/product-images/default.jpg'}
              style={{ width: '100%', maxWidth: '400px', height: '400px', objectFit: 'contain', borderRadius: '12px' }}
            />
          </div>

          {/* Miniaturas */}
          {productImages.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {productImages.map((img, i) => (
                <div 
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    border: selectedImage === i ? '2px solid #FF6B00' : '1px solid rgba(255,255,255,0.12)'
                  }}
                >
                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coluna Informações */}
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>{p.name}</h1>

          <div style={{ marginBottom: '24px' }}>
            <StarRating rating={p.rating || 0} size="large" showNumber />
          </div>

          <p style={{ marginBottom: '16px', color: 'rgba(229,229,229,0.70)' }}>
            {p.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Família olfativa', value: profile },
              { label: 'Concentração', value: 'Eau de Parfum' },
              { label: 'Fixação', value: '8-10 horas' },
              { label: 'Projeção', value: 'Moderada a intensa' },
              { label: 'Ocasião', value: 'Noite & eventos' },
              { label: 'Origem', value: 'Importado' }
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backgroundColor: 'rgba(255,255,255,0.03)'
                }}
              >
                <div style={{ fontSize: '12px', color: 'rgba(229,229,229,0.6)' }}>{item.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Preço */}
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#FF6B00', marginBottom: '8px' }}>
            R$ {Number(p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          <div style={{ marginBottom: '32px', color: '#A3A3A3' }}>
            📦 {p.stock} unidades disponíveis
          </div>

          {/* Quantidade */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>Quantidade:</label>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>−</button>
              <span style={{ fontWeight: 600 }}>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} disabled={p.stock !== undefined ? quantity >= p.stock : false}>+</button>
            </div>
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <button
              onClick={handleAddToCart}
              disabled={p.stock === 0 || isAddingToCart}
              style={{ flex: 1, padding: '16px 32px', backgroundColor: '#FF6B00', borderRadius: '12px', border: 'none', color: '#0F0F0F', fontWeight: 600 }}
            >
              {isAddingToCart ? '✔️ Adicionado!' : '🛒 Adicionar ao Carrinho'}
            </button>

            <button
              onClick={() => navigate('/carrinho')}
              style={{ padding: '16px 32px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'var(--dx-text)' }}
            >
              Ver Carrinho
            </button>
          </div>
        </div>
      </div>

      {/* Avaliações */}
      <div style={{ backgroundColor: 'var(--dx-surface)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Avaliações dos Clientes</h3>

        {mockReviews.map(r => (
          <div key={r.id} style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{r.userName}</div>
                <StarRating rating={r.rating} size="small" />
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(229,229,229,0.70)' }}>
                {new Date(r.date).toLocaleDateString('pt-BR')}
              </div>
            </div>

            <p style={{ marginTop: '12px', color: 'rgba(229,229,229,0.70)' }}>
              {r.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
