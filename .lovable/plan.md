

# Templates de Solicitação

## Arquivos modificados/criados (5)

### 1. `src/types/request.ts` — Adicionar interface RequestTemplate
```typescript
export interface RequestTemplate {
  id: string;
  name: string;
  description?: string;
  assetType: RequestType;
  quantity: number;
  priority: RequestPriority;
  specifications: Record<string, string>;
  createdByName: string;
  createdAt: string;
}
```

### 2. `src/data/mock-requests.ts` — Adicionar mock templates
6 templates realistas exportados via `getMockRequestTemplates()` / `setMockRequestTemplates()`:
- "5 Contas Ecommerce BRL Cartão" (CONTA_ANUNCIO, HIGH, qty 5)
- "3 Perfis Aquecidos com Proxy" (PERFIL, MEDIUM, qty 3)
- "1 BM para Anúncios" (BUSINESS_MANAGER, MEDIUM, qty 1)
- "10 Contas Infoprodutos USD" (CONTA_ANUNCIO, HIGH, qty 10)
- "2 Páginas com Histórico" (PAGINA, LOW, qty 2)
- "Recarga de Saldo R$ 500" (SALDO, URGENT, qty 1)

### 3. `src/hooks/useRequests.ts` — Adicionar hooks de templates
- `useRequestTemplates()` — query lista templates
- `useCreateRequestTemplate()` — mutation cria template
- `useDeleteRequestTemplate()` — mutation exclui template

### 4. `src/components/requests/RequestDialog.tsx` — Aceitar template e salvar como template
- Nova prop opcional `initialTemplate?: RequestTemplate`
- Se recebido, preencher `form.reset()` com dados do template no `useEffect`
- Adicionar ao final do formulário: checkbox "Salvar como template" + input nome do template (condicional)
- No `onSubmit`, se checkbox marcado, chamar `useCreateRequestTemplate` junto com a criação da request
- Adicionar campo `saveAsTemplate` e `templateName` ao schema (opcionais, validação condicional via `refine`)

### 5. `src/pages/Solicitacoes.tsx` — Adicionar view "Templates" e botão "Usar Template"
- View state expandido: `'list' | 'kanban' | 'templates'`
- Novo botão "Templates" no toggle group (ícone `FileText`)
- Botão "Usar Template" no header → abre Dialog de seleção de templates
- Novo componente inline `TemplatePickerDialog`: Dialog com grid de cards dos templates (nome, tipo com ícone, qty, prioridade badge). Ao clicar, fecha dialog e abre RequestDialog com `initialTemplate`
- View "templates": grid de cards com cada template mostrando nome, tipo, qty, prioridade, specs resumidas. Botões: "Usar" (abre RequestDialog preenchido), "Excluir" (com confirmação via toast)

## Fluxo do usuário

1. **Usar template existente**: Botão "Usar Template" → Dialog picker → seleciona → RequestDialog preenchido → edita se quiser → "Criar Solicitação"
2. **Salvar como template**: Ao criar solicitação → marca checkbox → nomeia → salva request + template
3. **Gerenciar templates**: Tab "Templates" → vê grid → pode usar ou excluir

## Detalhes técnicos
- Template picker: `Dialog` com `DialogContent` contendo grid `md:grid-cols-2 lg:grid-cols-3` de cards
- Estado `templateForDialog` em Solicitacoes controla o template passado ao RequestDialog
- RequestDialog faz `form.reset(...)` mapeando campos do template para os campos do form (assetType, quantity, priority, title preenchido com nome do template, specs mapeadas de volta para specNiche/specCurrency etc via função reversa de `buildSpecifications`)
- Para o mapeamento reverso de specs, criar `applySpecsToForm(type, specs, form)` que seta os campos spec* baseado no assetType

