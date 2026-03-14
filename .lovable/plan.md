

# Alterações no modal de Perfis + Remoção de "Misto" em Solicitações

## 1. ProfileDetailSheet — melhorias

### Anotação
- Botão "Salvar" alinhado à direita (`flex justify-end`)
- Ícone de "Histórico" (Clock/History) com tooltip ao lado do título "Anotação", que abre um Popover/Dialog listando versões anteriores da anotação (armazenadas em mock com timestamp e conteúdo anterior)

### Botão "Registrar Checkpoint"
- Alinhado à direita (`flex justify-end`)

### Campos editáveis inline
- No header e config grid, cada campo editável (nome, email, fornecedor, gestor, auxiliar, proxy, status, link do perfil, datas) será envolvido em um wrapper que:
  - Em hover mostra borda/fundo sutil (`hover:bg-muted/50 rounded cursor-pointer`)
  - Ao clicar, troca para input/select inline
  - Salva ao blur ou Enter, usa `useUpdateProfile`
- Campos como fornecedor/gestor/auxiliar usam select inline; proxy/email/nome usam input; status usa select com as opções; datas usam Popover+Calendar

### Organização completa das informações
- Header: avatar, nome (editável), email (editável + copy), status (editável), link do perfil (editável)
- Config grid com ícones: Fornecedor, Gestor, Auxiliar, Proxy, Senha (com copy/show), Dt. Recebimento, Dt. Desativação, Dt. Criação, Dt. Atualização
- Seção Anotação com histórico
- Tabs: Checkpoints, Aquecimento, Comentários

## 2. Hook para histórico de anotações
**`src/hooks/useProfiles.ts`**: Ao salvar anotação, guardar versão anterior num array mock. Novo hook `useAnnotationHistory(profileId)`.

**`src/data/mock-profiles.ts`**: Adicionar array `annotationHistory` no mock store.

## 3. Remoção de "Misto" em Solicitações

**`src/types/request.ts`**: Remover `'MISTO'` de `REQUEST_TYPES` e `REQUEST_TYPE_LABELS`.

**`src/components/requests/RequestDialog.tsx`**: Remover case `'MISTO'` do switch, remover `SpecMisto`, remover do schema enum, remover de `buildSpecifications` e `applySpecsToForm`.

**`src/pages/Solicitacoes.tsx`**: Remover `MISTO: Layers` do `ASSET_TYPE_ICONS`.

**`src/components/requests/detail-tabs/OverviewTab.tsx`**: Remover `MISTO` do icon map.

## Arquivos editados
- `src/components/profiles/ProfileDetailSheet.tsx` — refatoração completa
- `src/hooks/useProfiles.ts` — histórico de anotações
- `src/data/mock-profiles.ts` — mock de histórico
- `src/types/request.ts` — remover MISTO
- `src/components/requests/RequestDialog.tsx` — remover MISTO
- `src/pages/Solicitacoes.tsx` — remover MISTO do icon map
- `src/components/requests/detail-tabs/OverviewTab.tsx` — remover MISTO do icon map

