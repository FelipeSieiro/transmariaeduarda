# Análise de Arquitetura e Recomendações de Refatoração

## Data da Análise
08/08/2026

## Resumo Executivo
O projeto **Transmaria Eduarda** demonstra uma arquitetura sólida baseada em **Feature-Based Structure** com boa organização de tipos, serviços e componentes. No entanto, foram identificadas várias oportunidades de melhoria focadas em **DRY (Don't Repeat Yourself)**, **consistência** e **Clean Code**.

## Arquitetura Atual - Avaliação

### Pontos Fortes ✅
1. **Feature-Based Structure**: Organização clara por features (alunos, motoristas, veículos, etc.)
2. **Separação de Responsabilidades**: Tipos, serviços, hooks e componentes bem separados
3. **Componentes Comuns Reutilizáveis**: `FormField`, `SelectField`, `RowActions`, `ListToolbar`, etc.
4. **Hooks Customizados**: `useListControls`, `useAsyncData`, `useFormState` bem implementados
5. **Utility Functions Centralizadas**: Formatação de texto, moeda, data em `src/utils/`
6. **Factory Pattern para Services**: `createCrudService` reduz duplicação em services
7. **Barrel Files**: Index files para exports organizados

### Pontos de Melhoria Identificados 🔧

## 1. Duplicidade de Código e Componentes

### 1.1 Páginas de Listagem (Alta Prioridade)
**Problema**: As páginas de listagem seguem padrões muito similares, mas com implementações diferentes.

**Arquivos Afetados**:
- `src/features/alunos/pages/Alunos.tsx` (501 linhas) - Implementação customizada
- `src/features/motoristas/pages/Motoristas.tsx` (122 linhas) - Usa `useListControls`
- `src/features/veiculos/pages/Veiculos.tsx` (110 linhas) - Usa `useListControls`
- `src/features/responsaveis/pages/Responsaveis.tsx` (122 linhas) - Usa `useListControls`
- `src/features/contratos/pages/Contratos.tsx` (186 linhas) - Implementação customizada

**Recomendação**:
Criar um componente `ListPageTemplate` genérico que abstraia o padrão de listagem:

```typescript
// src/components/common/list-page-template.tsx
interface ListPageTemplateProps<T, S extends string> {
  title: string;
  subtitle: string;
  data: readonly T[];
  searchFields: (item: T) => readonly (string | null | undefined)[];
  sorters: Record<S, (a: T, b: T) => number>;
  initialSort: S;
  searchPlaceholder: string;
  tableComponent: React.ComponentType<{ data: readonly T[]; onDelete: (item: T) => void }>;
  onDelete: (item: T) => void;
  newItemRoute: string;
  sortLabels?: Record<S, string>;
  extraActions?: React.ReactNode;
  metricsComponent?: React.ReactNode;
}
```

**Benefícios**:
- Redução de ~400 linhas de código duplicado
- Consistência UX em todas as listagens
- Manutenção centralizada de bugs e melhorias

### 1.2 Formulários de Criação/Edição (Média Prioridade)
**Problema**: Páginas de formulário seguem padrão quase idêntico.

**Arquivos Afetados**:
- `src/features/motoristas/pages/NovoMotorista.tsx` (60 linhas)
- `src/features/veiculos/pages/NovoVeiculo.tsx` (60 linhas)
- `src/features/responsaveis/pages/NovoResponsavel.tsx` (similar)

**Recomendação**:
Criar `FormPageTemplate` genérico:

```typescript
// src/components/common/form-page-template.tsx
interface FormPageTemplateProps<T> {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  backTo: string;
  submitting: boolean;
  isEditing: boolean;
  submitLabel: string;
  children: React.ReactNode;
  onSubmit: () => void;
}
```

### 1.3 Hooks de Formulário (Média Prioridade)
**Problema**: Lógica muito similar em `useMotoristaForm`, `useVeiculoForm`, `useResponsavelForm`.

**Padrão Repetido**:
- Estado de form values
- Função `toPayload` para conversão
- Carregamento de dados para edição
- Validação básica
- Submissão com tratamento de erro

**Recomendação**:
Criar hook genérico `useEntityForm`:

```typescript
// src/hooks/use-entity-form.ts
interface UseEntityFormOptions<T, TCreate, TUpdate> {
  id: string | undefined;
  initialValues: T;
  toCreatePayload: (values: T) => TCreate;
  toUpdatePayload: (values: T) => TUpdate;
  service: {
    getById: (id: string) => Promise<T>;
    create: (data: TCreate) => Promise<T>;
    update: (id: string, data: TUpdate) => Promise<T>;
  };
  validate: (values: T) => string | null;
  successMessages: {
    create: string;
    update: string;
  };
  backRoute: string;
}
```

### 1.4 Formatação de Moeda (Baixa Prioridade)
**Problema**: Função `moeda()` duplicada em `Contratos.tsx` quando existe `formatCurrency` em utils.

**Arquivo**: `src/features/contratos/pages/Contratos.tsx:22-27`

**Recomendação**:
Substituir por:
```typescript
import { formatCurrency } from "@/utils/format-currency";
// Usar formatCurrency(Number(contrato.valor_mensalidade))
```

### 1.5 Helpers de Iniciais (Baixa Prioridade)
**Problema**: `getIniciais()` duplicado em `Alunos.tsx` quando existe `getInitials` em utils.

**Arquivo**: `src/features/alunos/pages/Alunos.tsx:54-60`

**Recomendação**:
Substituir por:
```typescript
import { getInitials } from "@/utils/format-text";
```

## 2. Inconsistência na Estrutura de Services

### 2.1 Padrões Diferentes de Implementação
**Problema**: Services usam abordagens diferentes para a mesma funcionalidade CRUD.

**Padrão 1 - createCrudService** (Recomendado):
- `motoristas.service.ts` - Usa `createCrudService`
- `veiculos.service.ts` - Usa `createCrudService`

**Padrão 2 - Implementação Manual**:
- `alunos.service.ts` - Implementação manual com lógica extra
- `contratos.service.ts` - Implementação manual
- `rotas.service.ts` - Implementação manual com aliases
- `responsaveis.service.ts` - Hybrid (createCrudService + override)

**Recomendação**:
Padronizar no uso de `createCrudService` quando possível, usando extensão para casos especiais:

```typescript
// Padrão recomendado para casos especiais
const baseService = createCrudService<Aluno, CreateAlunoDTO, UpdateAlunoDTO>(ENDPOINTS.ALUNOS);

export const alunosService = {
  ...baseService,
  // Métodos customizados
  criarAlunoCompleto: async (payload: CadastroAlunoCompleto) => {
    // implementação específica
  },
  buscarAluno: async (id: string) => {
    // implementação com lógica extra
  },
};
```

### 2.2 Inconsistência de Nomenclatura
**Problema**: Diferentes convenções de nomes em services.

**Exemplos**:
- `getAll` vs `listar` vs `listarRotas`
- `getById` vs `buscarPorId` vs `buscarRotaPorId`
- `create` vs `criar` vs `criarRota`
- `update` vs `atualizar` vs `atualizarRota`
- `remove` vs `remover` vs `removerRota`

**Recomendação**:
Padronizar em nomes em inglês (mais comum em TypeScript):
- `getAll`, `getById`, `create`, `update`, `remove`
- Manter métodos específicos em português se necessário

## 3. Inconsistência em Constants

### 3.1 Padrões Diferentes de Enum vs Array
**Problema**: Constants usam padrões diferentes.

**Padrão 1 - Enum + Array** (contrato.constants.ts):
```typescript
export enum FormaPagamento { PIX = "PIX", ... }
export const FORMAS_PAGAMENTO = Object.values(FormaPagamento);
```

**Padrão 2 - Array Direto** (motorista.constants.ts):
```typescript
export const STATUS_MOTORISTA: readonly SelectOption[] = [
  { value: "ativo", label: "Ativo" },
  ...
];
```

**Recomendação**:
Padronizar no uso de enums quando os valores são fixos e têm significado de domínio:

```typescript
// Padrão recomendado
export enum StatusMotorista {
  ATIVO = "ativo",
  INATIVO = "inativo",
}

export const STATUS_MOTORISTA_OPTIONS: readonly SelectOption[] = 
  Object.values(StatusMotorista).map(status => ({
    value: status,
    label: status === "ativo" ? "Ativo" : "Inativo",
  }));
```

### 3.2 Status Compartilhados
**Problema**: Status "ativo/inativo" duplicado em múltiplas features.

**Arquivos**:
- `motorista.constants.ts`
- `veiculo.constants.ts` (com extra "manutencao")

**Recomendação**:
Criar constantes compartilhadas em `src/constants/`:

```typescript
// src/constants/status.ts
export enum StatusComum {
  ATIVO = "ativo",
  INATIVO = "inativo",
}

export const STATUS_COMUM_OPTIONS: readonly SelectOption[] = [
  { value: StatusComum.ATIVO, label: "Ativo" },
  { value: StatusComum.INATIVO, label: "Inativo" },
];
```

## 4. Inconsistência em Estrutura de Features

### 4.1 Diretórios Adapters vs Mappers
**Problema**: Features usam nomes diferentes para a mesma funcionalidade.

**Estruturas Atuais**:
- `alunos/adapters/` 
- `contratos/adapters/`
- `responsaveis/adapters/` E `responsaveis/mappers/` (DUPLICADO!)

**Recomendação**:
Padronizar em `adapters/` para todas as features e remover duplicação em responsaveis.

### 4.2 Estrutura Incompleta
**Problema**: Algumas features não têm estrutura completa.

**Features Incompletas**:
- `escolas/` - Apenas types, sem services, pages, etc.
- `rotas/` - Sem constants, sem hooks, sem components
- `auth/` - Sem constants

**Recomendação**:
Completar estrutura de features conforme padrão estabelecido:
```
feature/
├── adapters/
├── components/
├── constants/
├── hooks/
├── pages/
├── services/
├── types/
└── index.ts
```

## 5. Violações de Clean Code

### 5.1 Funções Longas (Alta Prioridade)
**Problema**: Funções com muitas responsabilidades.

**Arquivos**:
- `src/features/alunos/pages/Alunos.tsx` - Componente com 501 linhas
- `src/features/alunos/pages/AlunoDetalhe.tsx` - Já refatorado para 203 linhas ✅

**Recomendação**:
- Componentes devem ter no máximo 200-250 linhas
- Extrair subcomponentes para lógica complexa
- Usar `useListControls` em vez de implementação customizada

### 5.2 Números Mágicos
**Problema**: Valores hardcoded sem explicação.

**Exemplos**:
- `PAGE_SIZE = 8` em `Alunos.tsx`
- `slice(0, 8)` em vários lugares
- Classes de tamanho hardcoded

**Recomendação**:
Usar constantes:
```typescript
// src/constants/pagination.ts (já existe)
export const DEFAULT_PAGE_SIZE = 8;

// Usar em todos os lugares
const pageSize = DEFAULT_PAGE_SIZE;
```

### 5.3 Comentários Redundantes
**Problema**: Comentários que apenas repetem o código.

**Exemplos**:
- `// Fonte única dos endpoints da API` (óbvio)
- `// Carrega a listagem de motoristas` (nome da função já diz)

**Recomendação**:
Remover comentários redundantes, manter apenas comentários que explicam **POR QUÊ** e não **O QUÊ**.

### 5.4 Tratamento de Erro Inconsistente
**Problema**: Diferentes abordagens para tratamento de erro.

**Padrões Encontrados**:
```typescript
// Padrão 1
try { ... } catch (error) {
  console.error("Erro ao X", error);
  toast.error("Erro ao X");
}

// Padrão 2
try { ... } catch (error) {
  console.error(error);
  toast.error(getApiErrorMessage(error, "Erro ao X"));
}

// Padrão 3
if (!window.confirm("Tem certeza?")) return;
```

**Recomendação**:
Padronizar no uso de `getApiErrorMessage` e `useConfirm`:

```typescript
// Padrão recomendado
const exclusao = useConfirm<Entity>(
  (entity) => void remover(entity.id),
);

// Na ação
onDelete={exclusao.request}

// No service
try { ... } catch (error) {
  console.error("Erro ao X", error);
  toast.error(getApiErrorMessage(error, "Erro ao X"));
}
```

## 6. Oportunidades de Globalização

### 6.1 Componentes de Tabela Genéricos
**Problema**: Componentes de tabela muito similares.

**Componentes Atuais**:
- `MotoristasTable.tsx` (111 linhas)
- `VeiculosTable.tsx` (100 linhas)
- `ResponsaveisTable.tsx` (91 linhas)

**Recomendação**:
Criar `GenericTable` component com render props:

```typescript
// src/components/common/generic-table.tsx
interface GenericTableProps<T> {
  data: readonly T[];
  columns: ColumnConfig<T>[];
  rowKey: (item: T) => string;
  onRowAction?: (item: T, action: string) => void;
}

interface ColumnConfig<T> {
  header: string;
  cell: (item: T) => React.ReactNode;
  className?: string;
}
```

### 6.2 Componentes de Form Field Específicos
**Problema**: Form fields repetidos em múltiplos formulários.

**Campos Repetidos**:
- Nome completo
- CPF
- Telefone
- Email
- Endereço

**Recomendação**:
Criar componentes de form field específicos:

```typescript
// src/components/common/form-fields/nome-field.tsx
// src/components/common/form-fields/cpf-field.tsx
// src/components/common/form-fields/telefone-field.tsx
// src/components/common/form-fields/email-field.tsx
// src/components/common/form-fields/endereco-field.tsx
```

## 7. Sugestões de Arquitetura

### 7.1 Camada de Repository Pattern
**Problema**: Services misturam lógica de API com lógica de negócio.

**Recomendação**:
Implementar Repository Pattern:

```
repositories/
├── alunos.repository.ts
├── motoristas.repository.ts
└── base.repository.ts

services/
├── alunos.service.ts (lógica de negócio)
└── motoristas.service.ts (lógica de negócio)
```

### 7.2 Validação com Zod
**Problema**: Validação manual e inconsistente em formulários.

**Recomendação**:
Integrar Zod para validação runtime:

```typescript
// src/features/motoristas/schemas/motorista.schema.ts
import { z } from "zod";

export const motoristaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cnh: z.string().min(5, "CNH inválida"),
  categoriaCnh: z.enum(["A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"]),
  salario: z.string().transform((val) => Number(val)).optional(),
  status: z.enum(["ativo", "inativo"]),
});
```

### 7.3 Testes
**Problema**: Não há evidência de testes automatizados.

**Recomendação**:
Adicionar estrutura de testes:

```
src/
├── __tests__/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── features/
    └── [feature]/
        └── __tests__/
            ├── components/
            ├── hooks/
            └── services/
```

## 8. Priorização de Recomendações

### Alta Prioridade 🔴
1. **Padronizar implementação de pages de listagem** - Usar `useListControls` em todas
2. **Unificar estrutura de services** - Padronizar no uso de `createCrudService`
3. **Remover duplicação de adapters/mappers** - Padronizar em `adapters/`
4. **Refatorar Alunos.tsx** - Reduzir de 501 para ~200 linhas

### Média Prioridade 🟡
1. **Criar templates genéricos** - `ListPageTemplate`, `FormPageTemplate`
2. **Padronizar constants** - Usar enums para status compartilhados
3. **Criar hook genérico de formulário** - `useEntityForm`
4. **Completar estrutura de features incompletas**

### Baixa Prioridade 🟢
1. **Implementar Repository Pattern** - Requer mais refactor
2. **Adicionar validação com Zod** - Melhoria de qualidade
3. **Criar componentes de form field específicos** - Melhoria de DX
4. **Adicionar testes automatizados** - Melhoria de qualidade

## 9. Próximos Passos Sugeridos

### Fase 1 - Quick Wins (1-2 dias)
1. Substituir `moeda()` por `formatCurrency` em Contratos.tsx
2. Substituir `getIniciais()` por `getInitials` em Alunos.tsx
3. Remover duplicação de `mappers/` em responsaveis
4. Padronizar nomenclatura de services

### Fase 2 - Padrões (3-5 dias)
1. Criar `ListPageTemplate` genérico
2. Migrar Alunos.tsx e Contratos.tsx para usar `useListControls`
3. Padronizar constants com enums
4. Criar `FormPageTemplate` genérico

### Fase 3 - Arquitetura (1-2 semanas)
1. Criar hook `useEntityForm` genérico
2. Implementar validação com Zod
3. Completar estrutura de features incompletas
4. Considerar Repository Pattern

## 10. Conclusão

O projeto possui uma **base arquitetural sólida** com Feature-Based Structure e boa separação de responsabilidades. As principais oportunidades de melhoria estão focadas em:

1. **Eliminar duplicação** de código em pages, services e components
2. **Padronizar padrões** em toda a codebase
3. **Melhorar consistência** na nomenclatura e estrutura
4. **Aplicar Clean Code** para reduzir complexidade

Seguindo as recomendações priorizadas, o projeto ganhará:
- **Manutenibilidade**: Código mais fácil de manter e evoluir
- **Consistência**: Padrões uniformes em toda a aplicação
- **Escalabilidade**: Estrutura preparada para crescimento
- **Qualidade**: Código mais limpo e following best practices

As mudanças sugeridas são **incrementais** e podem ser implementadas gradualmente sem grandes riscos.
