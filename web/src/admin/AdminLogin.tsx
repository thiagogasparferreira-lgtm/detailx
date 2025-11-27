import { useState } from 'react';
import { loginAdmin } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('thiagogasparferreira@gmail.com');
  const [senha, setSenha] = useState('admin123');
  const { login } = useAuth();
  const nav = useNavigate();
  const submit = async () => {
    const r = await loginAdmin(email, senha);
    if (r.token) { login(r.token); nav('/admin'); }
  };
  return (
    <div style={{ maxWidth: 360 }}>
      <h2>Login Admin</h2>
      <label>Email</label>
      <input value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} />
      <label>Senha</label>
      <input type="password" value={senha} onChange={e => setSenha(e.target.value)} style={{ width: '100%' }} />
      <button style={{ marginTop: 12 }} onClick={submit}>Entrar</button>
    </div>
  );
}