import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './screens/Home';
import Produtos from './screens/Produtos';
import DetalhesProduto from './screens/DetalhesProduto';
import Carrinho from './screens/Carrinho';
import Checkout from './screens/Checkout';
import ConfirmacaoPedido from './screens/ConfirmacaoPedido';
import MeusPedidos from './screens/MeusPedidos';
import DetalhePedido from './screens/DetalhePedido';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminProdutos from './admin/AdminProdutos';
import AdminPedidos from './admin/AdminPedidos';
import AdminFornecedores from './admin/AdminFornecedores';
import { useAuth } from './contexts/AuthContext';
import PedidoErro from './pages/pedido/erro';
import PedidoSucesso from './pages/pedido/sucesso';
import PedidoAguardando from './pages/pedido/aguardando';
import PedidoCancelado from './pages/pedido/cancelado';

function AdminGuard({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function RoutesView() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/produto/:id" element={<DetalhesProduto />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/pedido/confirmacao" element={<ConfirmacaoPedido />} />
      <Route path="/pedido/confirmacao/:id" element={<ConfirmacaoPedido />} />
      <Route path="/pedido/erro" element={<PedidoErro />} />
      <Route path="/pedido/erro/:id" element={<PedidoErro />} />
      <Route path="/pedido/sucesso" element={<PedidoSucesso />} />
      <Route path="/pedido/sucesso/:id" element={<PedidoSucesso />} />
      <Route path="/pedido/aguardando/:id" element={<PedidoAguardando />} />
      <Route path="/pedido/cancelado/:id" element={<PedidoCancelado />} />
      <Route path="/meus-pedidos" element={<MeusPedidos />} />
      <Route path="/pedido/:id" element={<DetalhePedido />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
      <Route path="/admin/produtos" element={<AdminGuard><AdminProdutos /></AdminGuard>} />
      <Route path="/admin/pedidos" element={<AdminGuard><AdminPedidos /></AdminGuard>} />
      <Route path="/admin/fornecedores" element={<AdminGuard><AdminFornecedores /></AdminGuard>} />
    </Routes>
  );
}