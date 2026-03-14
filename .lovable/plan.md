

# Refatoração da tabela e modal de detalhes de Perfis

## 1. ProfileTable — ícones hover + tooltip + nome clicável

**`src/components/profiles/ProfileTable.tsx`**:
- Colunas Email e Senha: adicionar `opacity-0 group-hover/row:opacity-100` nos botões de copiar/visualizar (o de senha já não tem, o de email também não)
- Envolver cada botão com `Tooltip` + `TooltipTrigger` + `TooltipContent` (labels: "Copiar email", "Copiar senha", "Mostrar senha", "Ocultar senha")
- Envolver com `TooltipProvider` no nível do componente
- Coluna Nome: tornar o texto do nome um elemento clicável (`cursor-pointer hover:underline`) que chama `onViewDetails(p)`

## 2. ProfileDetailSheet — refatoração completa

**`src/components/profiles/ProfileDetailSheet.tsx`** — reescrever como modal completo:

### Layout geral
- Sheet largo (`sm:max-w-3xl`)
- **Cabeçalho**: nome, email (com copy), status badge, link do perfil (se existir), dados do fornecedor/gestor/auxiliar/proxy
- **Seção de configurações** (grade 2 colunas): todos os campos do perfil exibidos de forma organizada (fornecedor, gestor, auxiliar, proxy, dt. recebimento, dt. desativação)
- **Anotação única**: textarea editável que salva/atualiza uma única anotação (não lista de anotações)
- **Tabs** com 3 abas:
  - **Checkpoints**: lista + botão registrar (com date picker customizado usando Popover+Calendar)
  - **Aquecimento**: checklist de ações
  - **Comentários**: feed de mensagens + input

### Remover aba "Anotações" separada
A anotação vira um campo editável fixo antes das tabs.

### Checkpoint date picker
Substituir `<Input type="date">` por Popover + Calendar (shadcn), com `pointer-events-auto`.

## 3. Hook de update annotation

**`src/hooks/useProfiles.ts`**: adicionar `useUpdateAnnotation` para editar anotação existente (não apenas criar).

## Arquivos editados
- `src/components/profiles/ProfileTable.tsx`
- `src/components/profiles/ProfileDetailSheet.tsx`
- `src/hooks/useProfiles.ts`

