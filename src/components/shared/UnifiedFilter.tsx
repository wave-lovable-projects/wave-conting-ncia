import { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Filter, ChevronRight, ArrowLeft, X } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterCategory {
  key: string;
  label: string;
  options: FilterOption[];
}

interface UnifiedFilterProps {
  categories: FilterCategory[];
  values: Record<string, string[]>;
  onChange: (values: Record<string, string[]>) => void;
}

export function UnifiedFilter({ categories, values, onChange }: UnifiedFilterProps) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string[]>>({});

  const totalActive = useMemo(
    () => Object.values(values).reduce((sum, arr) => sum + arr.length, 0),
    [values],
  );

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setDraft(structuredClone(values));
      setActiveCategory(null);
    }
    setOpen(isOpen);
  };

  const toggleItem = (categoryKey: string, itemValue: string) => {
    setDraft((prev) => {
      const current = prev[categoryKey] || [];
      const next = current.includes(itemValue)
        ? current.filter((v) => v !== itemValue)
        : [...current, itemValue];
      return { ...prev, [categoryKey]: next };
    });
  };

  const apply = () => {
    const cleaned: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(draft)) {
      if (v.length > 0) cleaned[k] = v;
    }
    onChange(cleaned);
    setOpen(false);
  };

  const clearAll = () => {
    onChange({});
    setDraft({});
    setOpen(false);
  };

  const removeChip = (categoryKey: string, value: string) => {
    const next = { ...values };
    next[categoryKey] = (next[categoryKey] || []).filter((v) => v !== value);
    if (next[categoryKey].length === 0) delete next[categoryKey];
    onChange(next);
  };

  const activeCtg = categories.find((c) => c.key === activeCategory);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={open} onOpenChange={handleOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {totalActive > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs"
              >
                {totalActive}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[280px] p-0" align="start">
          {!activeCategory ? (
            <div className="flex flex-col">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">Filtros</p>
              </div>
              <div className="py-1">
                {categories.map((cat) => {
                  const count = (draft[cat.key] || []).length;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-accent text-foreground transition-colors"
                    >
                      <span>{cat.label}</span>
                      <div className="flex items-center gap-2">
                        {count > 0 && (
                          <Badge
                            variant="secondary"
                            className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-xs"
                          >
                            {count}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between p-3 border-t border-border">
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Limpar
                </Button>
                <Button size="sm" onClick={apply}>
                  Aplicar
                </Button>
              </div>
            </div>
          ) : (
            <Command>
              <div className="flex items-center gap-2 p-3 border-b border-border">
                <button
                  onClick={() => setActiveCategory(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-foreground">{activeCtg?.label}</span>
              </div>
              <CommandInput placeholder={`Buscar ${activeCtg?.label.toLowerCase()}...`} />
              <CommandList>
                <CommandEmpty>Nenhum resultado.</CommandEmpty>
                {activeCtg?.options.map((opt) => {
                  const isSelected = (draft[activeCategory] || []).includes(opt.value);
                  return (
                    <CommandItem
                      key={opt.value}
                      value={opt.label}
                      onSelect={() => toggleItem(activeCategory, opt.value)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox checked={isSelected} className="pointer-events-none" />
                      <span>{opt.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>

      {/* Active filter chips */}
      {Object.entries(values).map(([catKey, selectedValues]) => {
        const cat = categories.find((c) => c.key === catKey);
        return selectedValues.map((val) => {
          const opt = cat?.options.find((o) => o.value === val);
          return (
            <Badge key={`${catKey}-${val}`} variant="secondary" className="gap-1 pl-2">
              {cat?.label}: {opt?.label || val}
              <button onClick={() => removeChip(catKey, val)} className="hover:text-foreground ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        });
      })}

      {totalActive > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({})}
          className="text-muted-foreground gap-1"
        >
          <X className="h-3.5 w-3.5" /> Limpar
        </Button>
      )}
    </div>
  );
}
