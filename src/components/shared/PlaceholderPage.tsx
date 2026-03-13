import { Construction, type LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  icon?: LucideIcon;
}

export function PlaceholderPage({ title, icon: Icon = Construction }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="rounded-full bg-surface-2 p-6 mb-6">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground">Em construção</p>
    </div>
  );
}
