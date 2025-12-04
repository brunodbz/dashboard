import React, { useState } from 'react';
import { authAPI } from '@/services/api';
import { AlertCircle, Lock, Shield, UserCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (token: string, user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { access_token } = await authAPI.login(username, password);
      localStorage.setItem('token', access_token);
      
      const userData = await authAPI.getCurrentUser();
      onLogin(access_token, userData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-5xl grid-cols-1 gap-8 rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur md:grid-cols-5">
          <div className="col-span-2 flex flex-col justify-between space-y-6 rounded-xl bg-gradient-to-b from-white/5 to-white/0 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-600/20 p-3 text-blue-400">
                <Shield className="h-10 w-10" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">SOC Dashboard</p>
                <h1 className="text-3xl font-bold text-white">Segurança em tempo real</h1>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Monitore incidentes, gestão de ativos e indicadores críticos com uma
              experiência refinada. Informe suas credenciais para acessar o painel
              operacional.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100">
                Monitoramento 24/7
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                Alertas em tempo real
              </span>
              <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-100">
                Dados criptografados
              </span>
            </div>
          </div>

          <div className="col-span-3 rounded-xl bg-slate-950/60 p-6 shadow-inner ring-1 ring-white/5">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">Acesse sua conta</h2>
              <p className="mt-2 text-sm text-slate-400">
                Entre com suas credenciais corporativas para continuar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Usuário</label>
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within:text-blue-400">
                    <UserCircle className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-10 py-3 text-white placeholder-slate-500 outline-none transition focus:border-blue-500/60 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/30"
                    placeholder="usuario.corporativo"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Senha</label>
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within:text-blue-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-10 py-3 text-white placeholder-slate-500 outline-none transition focus:border-blue-500/60 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/30"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-900/30 px-4 py-3 text-red-100">
                  <AlertCircle className="mt-0.5 h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <p className="text-center text-xs text-slate-500">
                Acesso restrito ao time de segurança. Não compartilhe suas credenciais.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
