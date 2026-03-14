

# Plano de Alterações

## 1. Rich Text no campo "Descrição" das Solicitações

Não há editor rich text no projeto. Vou instalar **@tiptap/react**, **@tiptap/starter-kit** e **@tiptap/extension-link** — editor leve, headless, que se integra bem com Tailwind.

### Componente `src/components/shared/RichTextEditor.tsx`
- Editor Tiptap com toolbar compacta: **Bold**, **Italic**, **Bullet List**, **Ordered List**
- Extensão Link para detectar/formatar URLs automaticamente
- Output em HTML (string), armazenado no campo `description`
- Estilização com classes Tailwind (prose para renderização)

### Componente `src/components/shared/RichTextViewer.tsx`
- Renderiza HTML sanitizado com `dangerouslySetInnerHTML` dentro de um container com classes `prose prose-sm` do Tailwind Typography
- Usado na visualização da descrição

### Alterações em arquivos existentes:

**`src/components/requests/RequestDialog.tsx`** (linhas 341-346):
- Substituir `<Textarea>` por `<RichTextEditor>` no campo description
- O editor recebe `value` (HTML string) e `onChange` (HTML string)

**`src/components/requests/detail-tabs/OverviewTab.tsx`** (linha 244):
- Substituir `<p>{request.description}</p>` por `<RichTextViewer content={request.description} />`

**`tailwind.config.ts`**:
- Adicionar plugin `@tailwindcss/typography` para classes `prose`

### Dependências a instalar:
- `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tailwindcss/typography`

---

## 2. Refatorar `/meta` — remover seções

**`src/pages/MetaDashboard.tsx`**:
- Remover imports: `MetaAccountCards`, `useTodayMetrics`, `useSpendByAccount`, `mockMetaAccounts`, `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `format`, `Card`, `CardContent`, `LoadingSpinner`, `ACCOUNT_COLORS`
- Manter apenas: `PageHeader`, `MetaConnectionStatus`, `MetaAlerts`, `useMetaAuthStatus`
- Bloco condicional `auth?.connected` renderiza somente `<MetaAlerts />`

Resultado final do componente será ~20 linhas.

