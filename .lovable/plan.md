

# Add "Aplicar" and "Limpar" to Category Item View

Currently, the "Aplicar" and "Limpar" buttons only appear on the category list panel. When the user drills into a specific category (the `Command` view with checkboxes), those buttons are missing.

## Change

Add the same footer with "Limpar" and "Aplicar" buttons below the `CommandList` inside the `Command` block (lines 137-165). "Limpar" in this context will clear only the current category's draft selections. "Aplicar" will apply all draft filters and close the popover.

## File: `src/components/shared/UnifiedFilter.tsx`

After the `</CommandList>` (line 164), before `</Command>` (line 165), add a footer div with the two buttons:

```tsx
<div className="flex items-center justify-between p-3 border-t border-border">
  <Button variant="ghost" size="sm" onClick={() => {
    setDraft(prev => ({ ...prev, [activeCategory!]: [] }));
  }}>
    Limpar
  </Button>
  <Button size="sm" onClick={apply}>
    Aplicar
  </Button>
</div>
```

Single file edit, ~5 lines added.

