import * as React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu } from 'lucide-react';

type Props = {
  cartCount?: number;
  onSearch?: (query: string) => void;
};

export default function HeaderDetailX({ cartCount = 0, onSearch }: Props) {
  const [query, setQuery] = React.useState('');
  const [openMobileMenu, setOpenMobileMenu] = React.useState(false);
  const [isWide, setIsWide] = React.useState(true);

  React.useEffect(() => {
    const update = () => setIsWide(window.innerWidth >= 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onSearch) onSearch(query);
  }

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-[#0F0F0F] text-white border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full flex justify-between h-16" style={{ alignItems: 'center', position: 'relative' }}>
        <div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', fontWeight: 800, letterSpacing: 0.4, fontSize: 22 }}>
              <span style={{ color: '#FFFFFF' }}>Aroma</span>
              <span style={{ color: '#FF6B00', marginLeft: 6 }}>Importados</span>
            </div>
          </Link>
        </div>

        {isWide && (
        <form onSubmit={handleSearchSubmit} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: 560, zIndex: 10 }}>
          <input
            type="text"
            placeholder="Buscar perfumes importados..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            style={{
              width: '100%',
              paddingLeft: 16,
              paddingRight: 16,
              height: 44,
              borderRadius: 9999,
              border: '1px solid rgba(255,255,255,0.10)',
              backgroundColor: '#1A1A1A',
              color: '#FFFFFF',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.25)';
              e.currentTarget.style.borderColor = '#FF6B00';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
            }}
          />
        </form>
        )}

        {!isWide && (
        <div className="flex-1 mx-6 hidden sm:block">
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%', maxWidth: 640 }}>
            <input
              type="text"
              placeholder="Buscar perfumes..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.25)';
                e.currentTarget.style.borderColor = '#FF6B00';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
              }}
              style={{
                width: '100%',
                paddingLeft: 40,
                paddingRight: 16,
                height: 40,
                borderRadius: 9999,
                border: '1px solid rgba(255,255,255,0.10)',
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                outline: 'none',
              }}
            />
            <Search
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.65)' }}
              size={18}
            />
          </form>
        </div>
        )}

        <div className="flex items-center gap-4">
          <Link
            to="/carrinho"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 9999,
              background: 'linear-gradient(90deg, #FF6B00 0%, #ff7f26 100%)',
              color: '#0F0F0F',
              boxShadow: '0 10px 30px rgba(255,107,0,0.25)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 14px 40px rgba(255,107,0,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,107,0,0.25)';
            }}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: '#FFFFFF',
                  color: '#FF6B00',
                  fontSize: 12,
                  borderRadius: 9999,
                  padding: '2px 8px',
                  border: '1px solid rgba(255,255,255,0.85)'
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setOpenMobileMenu(!openMobileMenu)}
            className="sm:hidden text-white"
            style={{ border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: 8 }}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
