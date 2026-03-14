import { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Filter, X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

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
  dateRange?: { from?: Date; to?: Date };
  onDateRangeChange?: (range: { from?: Date; to?: Date }) => void;
}

const DATE_CATEGORY_KEY = '__dateRange__';

export function UnifiedFilter({ categories, values, onChange, dateRange, onDateRangeChange }: UnifiedFilterProps) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string[]>>({});
  const [draftDateRange, setDraftDateRange] = useState<DateRange | undefined>();

  const hasDateRange = !!onDateRangeChange;

  const totalActive = useMemo(() => {
    let count = Object.values(values).reduce((sum, arr) => sum + arr.length, 0);
    if (dateRange?.from || dateRange?.to) count += 1;
    return count;
  }, [values, dateRange]);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setDraft(structuredClone(values));
      setDraftDateRange(dateRange ? { from: dateRange.from, to: dateRange.to } : undefined);
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
    if (hasDateRange) {
      onDateRangeChange!(draftDateRange ? { from: draftDateRange.from, to: draftDateRange.to } : {});
    }
    setOpen(false);
  };

  const clearAll = () => {
    onChange({});
    if (hasDateRange) onDateRangeChange!({});
    setDraft({});
    setDraftDateRange(undefined);
    setOpen(false);
  };

  const removeChip = (categoryKey: string, value: string) => {
    const next = { ...values };
    next[categoryKey] = (next[categoryKey] || []).filter((v) => v !== value);
    if (next[categoryKey].length === 0) delete next[categoryKey];
    onChange(next);
  };

  const removeDateChip = () => {
    if (hasDateRange) onDateRangeChange!({});
  };

  const clearCategory = (key: string) => {
    if (key === DATE_CATEGORY_KEY) {
      setDraftDateRange(undefined);
    } else {
      setDraft((prev) => ({ ...prev, [key]: [] }));
    }
  };

  const activeCtg = categories.find((c) => c.key === activeCategory);
  const isDateActive = activeCategory === DATE_CATEGORY_KEY;

  const dateChipLabel = useMemo(() => {
    if (!dateRange?.from) return null;
    const from = format(dateRange.from, 'dd/MM/yyyy');
    const to = dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : '...';
    return `${from} – ${to}`;
  }, [dateRange]);

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

        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Left pane — categories */}
            <div className="w-[180px] border-r border-border flex flex-col">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">Filtros</p>
              </div>
              <div className="py-1 flex-1">
                {categories.map((cat) => {
                  const count = (draft[cat.key] || []).length;
                  const isActive = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors text-foreground',
                        isActive ? 'bg-accent' : 'hover:bg-accent/50',
                      )}
                    >
                      <span>{cat.label}</span>
                      {count > 0 && (
                        <Badge
                          variant="secondary"
                          className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-xs"
                        >
                          {count}
                        </Badge>
                      )}
                    </button>
                  );
                })}
                {hasDateRange && (
                  <button
                    onClick={() => setActiveCategory(DATE_CATEGORY_KEY)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-foreground',
                      isDateActive ? 'bg-accent' : 'hover:bg-accent/50',
                    )}
                  >
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span>Período</span>
                    {(draftDateRange?.from) && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-xs"
                      >
                        1
                      </Badge>
                    )}
                  </button>
                )}
              </div>
              <div className="p-3 border-t border-border">
                <Button variant="ghost" size="sm" className="w-full" onClick={clearAll}>
                  Limpar tudo
                </Button>
              </div>
            </div>

            {/* Right pane — options or calendar */}
            {activeCategory && (
              <div className="w-[260px] flex flex-col">
                {isDateActive ? (
                  <div className="flex flex-col">
                    <Calendar
                      mode="range"
                      selected={draftDateRange}
                      onSelect={setDraftDateRange}
                      numberOfMonths={1}
                      className="p-3 pointer-events-auto"
                    />
                    <div className="flex items-center justify-between p-3 border-t border-border">
                      <Button variant="ghost" size="sm" onClick={() => clearCategory(DATE_CATEGORY_KEY)}>
                        Limpar
                      </Button>
                      <Button size="sm" onClick={apply}>
                        Aplicar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Command>
                    <CommandInput placeholder={`Buscar ${activeCtg?.label.toLowerCase()}...`} />
                    <CommandList className="max-h-[240px]">
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
                    <div className="flex items-center justify-between p-3 border-t border-border">
                      <Button variant="ghost" size="sm" onClick={() => clearCategory(activeCategory)}>
                        Limpar
                      </Button>
                      <Button size="sm" onClick={apply}>
                        Aplicar
                      </Button>
                    </div>
                  </Command>
                )}
              </div>
            )}
          </div>
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

      {dateChipLabel && (
        <Badge variant="secondary" className="gap-1 pl-2">
          Período: {dateChipLabel}
          <button onClick={removeDateChip} className="hover:text-foreground ml-0.5">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {totalActive > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onChange({});
            if (hasDateRange) onDateRangeChange!({});
          }}
          className="text-muted-foreground gap-1"
        >
          <X className="h-3.5 w-3.5" /> Limpar
        </Button>
      )}
    </div>
  );
}
