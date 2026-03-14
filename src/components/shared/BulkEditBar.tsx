import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronUp, Trash2, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BulkFieldConfig {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface BulkEditBarProps {
  count: number;
  fields: BulkFieldConfig[];
  onApply: (values: Record<string, string>) => void;
  onBulkDelete: () => void;
  onClear: () => void;
  isApplying?: boolean;
}

export function BulkEditBar({ count, fields, onApply, onBulkDelete, onClear, isApplying }: BulkEditBarProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [openField, setOpenField] = useState<string | null>(null);

  const setValue = (key: string, value: string) => {
    setValues(prev => {
      if (prev[key] === value) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: value };
    });
  };

  const hasChanges = Object.keys(values).length > 0;

  const handleApply = () => {
    if (!hasChanges) return;
    onApply(values);
    setValues({});
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="flex items-center gap-2 rounded-xl bg-background/95 backdrop-blur-sm px-4 py-3 border border-border shadow-lg pointer-events-auto">
        <span className="text-sm font-medium text-foreground whitespace-nowrap">
          {count} {count === 1 ? 'selecionado' : 'selecionados'}
        </span>
        <div className="h-5 w-px bg-border" />

        {fields.map(field => {
          const selected = values[field.key];
          const selectedLabel = field.options.find(o => o.value === selected)?.label;

          return (
            <Popover
              key={field.key}
              open={openField === field.key}
              onOpenChange={open => setOpenField(open ? field.key : null)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant={selected ? 'default' : 'outline'}
                  size="sm"
                  className="gap-1.5"
                >
                  {selectedLabel || field.label}
                  <ChevronUp className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="w-56 p-0 pointer-events-auto">
                <Command>
                  <CommandInput placeholder={`Buscar ${field.label.toLowerCase()}...`} />
                  <CommandList>
                    <CommandEmpty>Nenhum resultado.</CommandEmpty>
                    <CommandGroup>
                      {field.options.map(option => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={() => {
                            setValue(field.key, option.value);
                            setOpenField(null);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selected === option.value ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        })}

        <div className="h-5 w-px bg-border" />

        {hasChanges && (
          <Button size="sm" onClick={handleApply} disabled={isApplying}>
            {isApplying ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : null}
            Aplicar
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={onBulkDelete}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Excluir
        </Button>

        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
