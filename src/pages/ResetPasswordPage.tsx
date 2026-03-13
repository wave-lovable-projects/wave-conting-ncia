import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Waves, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const resetSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
});

export default function ResetPasswordPage() {
  const [sent, setSent] = useState(false);

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Waves className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-foreground tracking-tight">WAVE</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-elevated">
          {sent ? (
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-success/15 p-4 mb-4">
                <Mail className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Email enviado!</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Se o email estiver cadastrado, você receberá um link para redefinir sua senha.
              </p>
              <Link to="/login">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
                Redefinir senha
              </h2>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                Informe seu email para receber o link de redefinição.
              </p>
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
                  <Button type="submit" className="w-full">
                    Enviar link
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors gap-1 inline-flex items-center">
                  <ArrowLeft className="h-3 w-3" />
                  Voltar ao login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
