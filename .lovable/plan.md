

# Refazer RequestDialog com formulário inteligente e validação Zod

## Abordagem

Reescrever `src/components/requests/RequestDialog.tsx` com react-hook-form + zod. O formulário terá 2 seções visuais: "Informações Gerais" e "Especificações do Ativo" (campos dinâmicos por tipo).

## Arquivo editado

**`src/components/requests/RequestDialog.tsx`** — reescrita completa:

### Estrutura do formulário

1. **Seção "Informações Gerais"** com título visual (`h3` + `Separator`):
   - Título (text, required)
   - Tipo de Ativo (select dos 7 tipos) + Quantidade (number, min 1) — grid 2 cols
   - Prioridade (select LOW/MEDIUM/HIGH/URGENT)
   - Data desejada de entrega (date picker com Popover+Calendar)
   - Descrição (textarea, required)

2. **Seção "Especificações do Ativo"** — renderização condicional baseada em `watch('assetType')`:

   | Tipo | Campos |
   |------|--------|
   | CONTA_ANUNCIO | Nicho (select mockNiches), Moeda (BRL/USD), Pagamento (Cartão/Agência), BM desejada (select mockBMs, opcional) |
   | PERFIL | Proxy (text), Nível aquecimento (select: Novo/Parcialmente aquecido/Totalmente aquecido) |
   | BUSINESS_MANAGER | Função (select: Anúncios/Backup/Pixels/Páginas/Misto), Fornecedor preferido (select mockSuppliers, opcional) |
   | PAGINA | Nicho (select), Com histórico (Switch) |
   | PIXEL | Domínio alvo (text), BM desejada (select, opcional) |
   | SALDO | Conta destino (select mockAdAccounts), Valor (number) + Moeda (BRL/USD) |
   | MISTO | Textarea livre para detalhes |

### Validação (Zod)
- `title`: string, trim, min 1
- `assetType`: enum dos 7 tipos
- `quantity`: number, min 1
- `priority`: enum
- `description`: string, trim, min 1
- `dueDate`: date opcional
- `specifications`: Record<string,string> opcional (preenchido dinamicamente no onSubmit)

### Dados de referência (imports)
- `mockNiches`, `mockSuppliers` de `@/data/mock-ad-accounts`
- `getMockBMs` de `@/data/mock-business-managers`
- `getMockAdAccounts` de `@/data/mock-ad-accounts`
- `bmFunctions` de `@/data/mock-business-managers`

### Comportamento no submit
- Coletar os campos de especificação em um `Record<string, string>` baseado no tipo selecionado
- Chamar `createMutation.mutateAsync` com `specifications` populado
- Reset do form e fechar sheet

### Visual
- Sheet lateral `sm:max-w-lg`, overflow-y-auto
- Seções separadas por `<h3>` + `<Separator>` com `space-y-4`
- Usa `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` do shadcn/ui
- Dark/neutro consistente (bg-card, border-border, text-foreground)

