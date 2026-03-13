import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Waves, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { setTokens } from '@/lib/auth';
import { useUIStore } from '@/store/ui.store';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUIStore((s) => s.setUser);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      // Mock login — replace with real API call
      await new Promise((r) => setTimeout(r, 1000));

      if (data.email === 'admin@wave.com' && data.password === '123456') {
        const mockUser = {
          id: '1',
          name: 'Admin Wave',
          email: data.email,
          role: 'ADMIN' as const,
          squadId: null,
        };
        setTokens('mock-access-token', 'mock-refresh-token');
        setUser(mockUser);
        localStorage.setItem('wave_user', JSON.stringify(mockUser));
        navigate('/');
      } else {
        toast({
          title: 'Erro ao fazer login',
          description: 'Credenciais inválidas. Tente novamente.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Erro ao fazer login',
        description: 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Waves className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-foreground tracking-tight">WAVE</span>
          </div>
          <span className="text-xs text-muted-foreground tracking-[0.3em] uppercase">
            Contingência
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-elevated">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
            Entrar na plataforma
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Entrar
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <Link
              to="/reset-password"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>

          <div className="mt-6 p-3 rounded-lg bg-surface-1 border border-border-subtle">
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-medium text-foreground">Demo:</span> admin@wave.com / 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
