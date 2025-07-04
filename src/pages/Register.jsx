import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('backer');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, role);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-primary">Register</h2>
        <input className="mb-3 w-full px-3 py-2 border rounded" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input className="mb-3 w-full px-3 py-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="mb-3 w-full px-3 py-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <select className="mb-3 w-full px-3 py-2 border rounded" value={role} onChange={e => setRole(e.target.value)}>
          <option value="backer">Backer</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        {error && <div className="text-error mb-2">{error}</div>}
        <button className="bg-primary text-white px-4 py-2 rounded w-full" type="submit">Register</button>
      </form>
    </div>
  );
} 