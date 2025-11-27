import { Outlet } from 'react-router-dom';
import RoutesView from './routes';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import HeaderDetailX from './components/HeaderDetailX';

 

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>

        <HeaderDetailX />

        <main 
          style={{ 
            padding: 16, 
            paddingTop: 80, 
            backgroundColor: '#0F0F0F', 
            color: '#E5E5E5', 
            minHeight: 'calc(100vh - 80px)', 
          }} 
        > 
          <RoutesView /> 
          <Outlet /> 
        </main>

      </CartProvider>
    </AuthProvider>
  );
}