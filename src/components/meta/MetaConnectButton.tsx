import { Facebook, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConnectMeta } from '@/hooks/useMeta';

export function MetaConnectButton() {
  const { mutate, isPending } = useConnectMeta();

  return (
    <Button onClick={() => mutate()} disabled={isPending} className="gap-2">
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Facebook className="h-4 w-4" />}
      {isPending ? 'Conectando...' : 'Conectar com Meta'}
    </Button>
  );
}
