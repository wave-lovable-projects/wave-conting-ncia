

# Ajustes no modal de Nova Solicitação

## Alterações por tipo de ativo

### CONTA_ANUNCIO
- Remover campo "Nicho Desejado" (specNiche) das specs
- Adicionar opção "Indiferente" em Moeda e Tipo de Pagamento
- Converter "BM Desejada" para Popover + Command combobox com scroll

### BUSINESS_MANAGER
- Marcar "Função Desejada" como opcional (já é, apenas ajustar label se necessário)
- Converter "Fornecedor Preferido" para Popover + Command combobox com scroll

### PERFIL
- Marcar "Tipo de Proxy Necessário" como opcional (já é, ajustar label)
- Remover campo "Nível de Aquecimento" (specWarmingLevel)

### PAGINA
- Remover toda a seção de especificações (remover specNiche e specHistory/comHistorico)
- SpecPagina retorna null ou mensagem "Sem especificações adicionais"

### SALDO
- Converter "Conta de Destino" para Popover + Command combobox com scroll

## Componente ComboboxField reutilizável
Criar um componente inline (ou dentro do arquivo) que usa Popover + Command + CommandInput + CommandList + CommandItem para os 3 campos que precisam de combobox: BM Desejada, Fornecedor Preferido, Conta de Destino.

## Arquivo editado
- `src/components/requests/RequestDialog.tsx`

## Limpeza
- Remover referências a specNiche em buildSpecifications para CONTA_ANUNCIO
- Remover referências a specWarmingLevel em buildSpecifications para PERFIL
- Remover SpecPagina specs de buildSpecifications
- Remover applySpecsToForm para campos removidos

