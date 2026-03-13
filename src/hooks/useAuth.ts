import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore, type User } from '@/store/ui.store';
import { setTokens, clearTokens } from '@/lib/auth';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export function useAuth() {
  const navigate = useNavigate();
  const user = useUIStore((s) => s.user);
  const setUser = useUIStore((s) => s.setUser);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { data } = await api.post('/auth/login', { email, password });
        setTokens(data.accessToken, data.refreshToken);
        const userData: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          squadId: data.user.squadId ?? null,
        };
        setUser(userData);
        localStorage.setItem('wave_user', JSON.stringify(userData));
        navigate('/');
      } catch (err: any) {
        const message =
          err.response?.data?.message || 'Credenciais inválidas. Tente novamente.';
        toast({
          title: 'Erro ao fazer login',
          description: message,
          variant: 'destructive',
        });
        throw err;
      }
    },
    [navigate, setUser]
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    localStorage.removeItem('wave_user');
    navigate('/login');
  }, [navigate, setUser]);

  const restoreUser = useCallback(() => {
    const stored = localStorage.getItem('wave_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('wave_user');
      }
    }
  }, [setUser]);

  return { user, login, logout, restoreUser };
}
