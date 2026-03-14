
# Fix: Scroll nos Comboboxes

**Problema**: O `ScrollArea` do Radix está envolvendo os `CommandItem`s dentro do `CommandList`, o que conflita com o scroll nativo do `cmdk`. O `CommandList` já tem `overflow-y: auto` por padrão.

**Solução**: Remover o `ScrollArea` wrapper e aplicar `max-h-[200px]` diretamente no `CommandList`.

**Arquivo**: `src/components/requests/RequestDialog.tsx`

**Alteração** (linhas 111-125):
```tsx
// De:
<CommandList>
  <CommandEmpty>Nenhum resultado.</CommandEmpty>
  <ScrollArea className="max-h-[200px]">
    {options.map(...)}
  </ScrollArea>
</CommandList>

// Para:
<CommandList className="max-h-[200px]">
  <CommandEmpty>Nenhum resultado.</CommandEmpty>
  {options.map(...)}
</CommandList>
```

Também remover o import de `ScrollArea` se não for mais usado no arquivo.
