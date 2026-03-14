

# Refatoração da UI/UX de Edição Inline no Detalhe do Perfil

## Problemas Identificados

1. **`EditableField`**: Ao clicar, substitui o texto por um `<Input>` com bordas — cria um "box" que quebra a leitura visual. O usuário quer que o texto continue com a mesma aparência, mas editável.
2. **`EditableSelect`**: Sempre mostra um `SelectTrigger` com borda como se fosse formulário, mesmo em modo de visualização. Deveria parecer texto normal e virar dropdown só ao interagir.
3. **Campos como Fornecedor, Gestor e Auxiliar**: São campos de texto livre mas deveriam ser dropdowns com opções pré-definidas (mesmas opções da página Perfis).

## Plano de Alterações

**Arquivo**: `src/components/profiles/ProfileDetailSheet.tsx`

### 1. Refatorar `EditableField` — edição inline sem caixa

- Substituir o `<Input>` por um `<input>` estilizado como texto transparente (sem borda, sem background, mesma fonte/tamanho do texto de visualização).
- Usar `border: none; background: transparent; outline: none` com um sutil underline pontilhado ou cursor de texto ao focar para indicar que está editável.
- Manter o ícone de lápis no hover como dica visual.
- O campo muda entre `readOnly` e editável ao clicar, sem trocar de componente — elimina o "flash" visual.

### 2. Refatorar `EditableSelect` — parecer texto, abrir dropdown ao clicar

- Em modo "repouso": renderizar como texto normal (mesma aparência do `EditableField`) com ícone de lápis no hover.
- Ao clicar: abrir o `Select` dropdown diretamente (usar `open` controlado).
- Após seleção, volta ao modo texto.
- Remover a borda permanente do `SelectTrigger`.

### 3. Fornecedor, Gestor e Auxiliar → `EditableSelect`

- Converter estes 3 campos na `ProfileConfigGrid` de `EditableField` (texto livre) para `EditableSelect` com as mesmas opções usadas na página `/perfis` (`SUPPLIER_OPTIONS`, `MANAGER_OPTIONS`, etc.).
- Atualizar tanto o `id` quanto o `name` ao selecionar (ex: `supplierId` + `supplierName`).

### 4. Status no header — mesma padronização

- Aplicar o mesmo padrão visual ao select de status: parecer um `StatusBadge` em repouso, abrir dropdown ao clicar.

### Resultado Visual Esperado

```text
Antes (atual):
┌──────────────────┐
│ Fornecedor       │
│ [══════════════]  │  ← Input box com bordas ao editar
└──────────────────┘

Depois (proposto):
  Fornecedor
  Fornecedor Alpha ✎   ← Texto normal, lápis no hover, click abre dropdown
```

