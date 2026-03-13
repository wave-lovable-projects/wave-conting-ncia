import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useConnectMeta } from '@/hooks/useMeta';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function MetaCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const connectMeta = useConnectMeta();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const code = searchParams.get('code');
    if (!code) {
      toast({ title: 'Autenticação cancelada', description: 'O processo de conexão com a Meta foi cancelado.' });
      navigate('/meta', { replace: true });
      return;
    }

    connectMeta.mutate(undefined, {
      onSuccess: () => navigate('/meta', { replace: true }),
      onError: () => navigate('/meta', { replace: true }),
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <LoadingSpinner size={40} />
      <p className="text-muted-foreground">Finalizando conexão com a Meta...</p>
    </div>
  );
}
