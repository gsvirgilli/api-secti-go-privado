# 🔄 Guia de Sincronização Frontend-Backend

## 📋 Resumo Executivo

Este documento descreve todas as mudanças necessárias no backend para sincronizar com as novas telas implementadas no frontend (Inscrição e Processo Seletivo).

---

## 🎯 Páginas Novas do Frontend

### 1. **Inscricao.tsx** (2,382 linhas)
- Formulário público de inscrição em 7 etapas
- Coleta dados pessoais, endereço, questionário social, responsável legal
- Envia para endpoint: `POST /api/candidates/public`

### 2. **ProcessoSeletivo.tsx** (1,817 linhas)
- Página administrativa para gerenciar candidatos
- Visualização, aprovação, reprovação de candidatos
- Configuração do formulário de inscrição (campos visíveis/obrigatórios)

### 3. **Sobre.tsx** (395 linhas)
- Página institucional pública

---

## 📦 Status Atual do Backend

### ✅ O que já existe:
1. **Migration completa**: `20251112000001_add_extended_candidate_fields.cjs`
   - Adiciona TODOS os 20 campos novos
2. **Tabela `candidatos`** no banco com estrutura completa
3. **Endpoint público**: `/api/candidates/public` (precisa verificar)
4. **Endpoint de listagem**: `/api/courses/public` (precisa criar)

### ❌ O que precisa ser atualizado:

1. **Model `candidate.model.ts`** - Faltam 20 campos
2. **Validadores** - Adicionar validações para novos campos
3. **Controller** - Atualizar para aceitar novos campos
4. **API pública de cursos** - Criar endpoint sem autenticação

---

## 🗄️ Mudanças no Banco de Dados

### Campos Adicionados na Migration (20 campos novos):

```sql
-- Dados pessoais adicionais (6 campos)
rg VARCHAR(20)
sexo ENUM('FEMININO', 'MASCULINO', 'OUTRO', 'PREFIRO_NAO_INFORMAR')
deficiencia ENUM('NAO', 'AUDITIVA', 'VISUAL', 'FISICA', 'INTELECTUAL', 'MULTIPLA')
telefone2 VARCHAR(20)
idade INTEGER
nome_mae VARCHAR(100)

-- Curso - segunda opção (3 campos)
curso_id2 INTEGER (FK para cursos)
turno2 ENUM('MATUTINO', 'VESPERTINO', 'NOTURNO')
local_curso VARCHAR(100)

-- Questionário Social (5 campos)
raca_cor ENUM('BRANCO', 'PARDO', 'NEGRO', 'INDIGENA', 'AMARELO')
renda_mensal ENUM('SEM_RENDA', 'ATE_MEIO_SM', 'ATE_1_SM', '1_A_2_SM', '2_A_3_SM', '3_A_4_SM', 'ACIMA_5_SM')
pessoas_renda VARCHAR(20)
tipo_residencia ENUM('PROPRIA_QUITADA', 'PROPRIA_FINANCIADA', 'ALUGADA', 'HERDADA', 'CEDIDA')
itens_casa VARCHAR(200) -- Separado por vírgula: TV,CELULAR,COMPUTADOR,INTERNET

-- Programa Goianas (1 campo)
goianas_ciencia ENUM('SIM', 'NAO')

-- Responsável Legal (3 campos)
menor_idade BOOLEAN DEFAULT false
nome_responsavel VARCHAR(100)
cpf_responsavel VARCHAR(11)

-- Documentos (9 campos) - da migration 20251112120000_add_document_fields.cjs
rg_frente_url VARCHAR(255)
rg_verso_url VARCHAR(255)
cpf_aluno_url VARCHAR(255)
comprovante_endereco_url VARCHAR(255)
identidade_responsavel_frente_url VARCHAR(255)
identidade_responsavel_verso_url VARCHAR(255)
cpf_responsavel_url VARCHAR(255)
comprovante_escolaridade_url VARCHAR(255)
foto_3x4_url VARCHAR(255)
```

### ✅ Como Executar as Migrations:

```bash
# Dentro do container Docker
docker exec app_backend npx sequelize-cli db:migrate

# Ou se preferir rodar localmente
cd backend
npx sequelize-cli db:migrate
```

---

## 🔧 Mudanças Necessárias no Código

### 1. **Atualizar `candidate.model.ts`**

**Arquivo:** `backend/src/modules/Candidates/candidate.model.ts`

**Adicionar declarações de tipos:**
```typescript
class Candidate extends Model {
  // ... campos existentes ...
  
  // Dados pessoais adicionais
  declare rg: string | null;
  declare sexo: 'FEMININO' | 'MASCULINO' | 'OUTRO' | 'PREFIRO_NAO_INFORMAR' | null;
  declare deficiencia: 'NAO' | 'AUDITIVA' | 'VISUAL' | 'FISICA' | 'INTELECTUAL' | 'MULTIPLA' | null;
  declare telefone2: string | null;
  declare idade: number | null;
  declare nome_mae: string | null;
  
  // Curso - segunda opção
  declare curso_id2: number | null;
  declare turno2: 'MATUTINO' | 'VESPERTINO' | 'NOTURNO' | null;
  declare local_curso: string | null;
  
  // Questionário Social
  declare raca_cor: 'BRANCO' | 'PARDO' | 'NEGRO' | 'INDIGENA' | 'AMARELO' | null;
  declare renda_mensal: 'SEM_RENDA' | 'ATE_MEIO_SM' | 'ATE_1_SM' | '1_A_2_SM' | '2_A_3_SM' | '3_A_4_SM' | 'ACIMA_5_SM' | null;
  declare pessoas_renda: string | null;
  declare tipo_residencia: 'PROPRIA_QUITADA' | 'PROPRIA_FINANCIADA' | 'ALUGADA' | 'HERDADA' | 'CEDIDA' | null;
  declare itens_casa: string | null;
  
  // Programa Goianas
  declare goianas_ciencia: 'SIM' | 'NAO' | null;
  
  // Responsável Legal
  declare menor_idade: boolean;
  declare nome_responsavel: string | null;
  declare cpf_responsavel: string | null;
  
  // Documentos
  declare rg_frente_url: string | null;
  declare rg_verso_url: string | null;
  declare cpf_aluno_url: string | null;
  declare comprovante_endereco_url: string | null;
  declare identidade_responsavel_frente_url: string | null;
  declare identidade_responsavel_verso_url: string | null;
  declare cpf_responsavel_url: string | null;
  declare comprovante_escolaridade_url: string | null;
  declare foto_3x4_url: string | null;
}
```

**Adicionar definições de campos no `Candidate.init()`:**
```typescript
Candidate.init({
  // ... campos existentes ...
  
  // Dados pessoais adicionais
  rg: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  sexo: {
    type: DataTypes.ENUM('FEMININO', 'MASCULINO', 'OUTRO', 'PREFIRO_NAO_INFORMAR'),
    allowNull: true,
  },
  deficiencia: {
    type: DataTypes.ENUM('NAO', 'AUDITIVA', 'VISUAL', 'FISICA', 'INTELECTUAL', 'MULTIPLA'),
    allowNull: true,
  },
  telefone2: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nome_mae: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  
  // Curso - segunda opção
  curso_id2: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'cursos',
      key: 'id',
    }
  },
  turno2: {
    type: DataTypes.ENUM('MATUTINO', 'VESPERTINO', 'NOTURNO'),
    allowNull: true,
  },
  local_curso: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  
  // Questionário Social
  raca_cor: {
    type: DataTypes.ENUM('BRANCO', 'PARDO', 'NEGRO', 'INDIGENA', 'AMARELO'),
    allowNull: true,
  },
  renda_mensal: {
    type: DataTypes.ENUM('SEM_RENDA', 'ATE_MEIO_SM', 'ATE_1_SM', '1_A_2_SM', '2_A_3_SM', '3_A_4_SM', 'ACIMA_5_SM'),
    allowNull: true,
  },
  pessoas_renda: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  tipo_residencia: {
    type: DataTypes.ENUM('PROPRIA_QUITADA', 'PROPRIA_FINANCIADA', 'ALUGADA', 'HERDADA', 'CEDIDA'),
    allowNull: true,
  },
  itens_casa: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  
  // Programa Goianas
  goianas_ciencia: {
    type: DataTypes.ENUM('SIM', 'NAO'),
    allowNull: true,
  },
  
  // Responsável Legal
  menor_idade: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  nome_responsavel: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  cpf_responsavel: {
    type: DataTypes.STRING(11),
    allowNull: true,
  },
  
  // Documentos
  rg_frente_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  rg_verso_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  cpf_aluno_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  comprovante_endereco_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  identidade_responsavel_frente_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  identidade_responsavel_verso_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  cpf_responsavel_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  comprovante_escolaridade_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  foto_3x4_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  // ... resto da configuração ...
});
```

---

### 2. **Criar Endpoint Público de Cursos**

**Arquivo:** `backend/src/routes/course.routes.ts`

Adicionar rota pública:
```typescript
// Rota pública para listar cursos (sem autenticação)
router.get('/public', courseController.listPublicCourses);
```

**Arquivo:** `backend/src/modules/courses/course.controller.ts`

Adicionar método:
```typescript
async listPublicCourses(req: Request, res: Response) {
  try {
    const courses = await Course.findAll({
      where: { 
        status: 'ATIVO' // Apenas cursos ativos
      },
      attributes: ['id', 'nome', 'descricao', 'carga_horaria', 'nivel', 'status'],
      order: [['nome', 'ASC']]
    });

    res.json({
      success: true,
      data: courses,
      message: 'Cursos listados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao listar cursos públicos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar cursos disponíveis'
    });
  }
}
```

---

### 3. **Verificar/Criar Endpoint Público de Candidatos**

**Arquivo:** `backend/src/routes/candidate.routes.ts`

```typescript
// Rota pública para criar candidatura (sem autenticação)
router.post('/public', candidateController.createPublicCandidate);
```

**Arquivo:** `backend/src/modules/Candidates/candidate.controller.ts`

```typescript
async createPublicCandidate(req: Request, res: Response) {
  try {
    const candidateData = req.body;
    
    // Validações básicas
    if (!candidateData.nome || !candidateData.cpf || !candidateData.email) {
      return res.status(400).json({
        success: false,
        error: 'Nome, CPF e email são obrigatórios'
      });
    }

    // Criar candidato
    const candidate = await Candidate.create({
      ...candidateData,
      status: 'pendente'
    });

    res.status(201).json({
      success: true,
      data: candidate,
      message: 'Candidatura enviada com sucesso!'
    });
  } catch (error: any) {
    console.error('Erro ao criar candidatura pública:', error);
    
    // Tratamento de erros de validação do Sequelize
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'CPF ou email já cadastrado'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro ao processar candidatura'
    });
  }
}
```

---

### 4. **Upload de Documentos (Middleware)**

**Arquivo:** `backend/src/middlewares/upload.ts` ✅ **JÁ EXISTE**

O middleware de upload já foi criado. Agora precisa criar as rotas:

**Arquivo:** `backend/src/routes/candidate.routes.ts`

```typescript
import upload from '../middlewares/upload.js';

// Rota para upload de documentos
router.post(
  '/:id/documents',
  authenticate,
  authorize(['ADMIN']),
  upload.fields([
    { name: 'rg_frente', maxCount: 1 },
    { name: 'rg_verso', maxCount: 1 },
    { name: 'cpf_aluno', maxCount: 1 },
    { name: 'comprovante_endereco', maxCount: 1 },
    { name: 'identidade_responsavel_frente', maxCount: 1 },
    { name: 'identidade_responsavel_verso', maxCount: 1 },
    { name: 'cpf_responsavel', maxCount: 1 },
    { name: 'comprovante_escolaridade', maxCount: 1 },
    { name: 'foto_3x4', maxCount: 1 }
  ]),
  candidateController.uploadDocuments
);
```

---

## 📝 Checklist de Implementação

### Banco de Dados
- [x] Migration `20251112000001_add_extended_candidate_fields.cjs` criada
- [x] Migration `20251112120000_add_document_fields.cjs` criada
- [ ] **Executar migrations**: `docker exec app_backend npx sequelize-cli db:migrate`

### Model
- [ ] Atualizar `candidate.model.ts` com 29 campos novos
- [ ] Adicionar associação com Course para `curso_id2`

### Controller
- [ ] Atualizar `createPublicCandidate` para aceitar todos os campos
- [ ] Criar método `uploadDocuments` para upload de arquivos
- [ ] Implementar `listPublicCourses` no course.controller

### Routes
- [ ] Adicionar rota `POST /api/candidates/public`
- [ ] Adicionar rota `GET /api/courses/public`
- [ ] Adicionar rota `POST /api/candidates/:id/documents`

### Validações
- [ ] Validar CPF do responsável (se menor de idade)
- [ ] Validar campos ENUM
- [ ] Validar uploads de arquivo (tamanho, tipo)

---

## 🧪 Testes Necessários

### 1. Testar Inscrição Pública
```bash
curl -X POST http://localhost:3333/api/candidates/public \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Completo",
    "cpf": "12345678900",
    "email": "teste@email.com",
    "telefone": "62999887766",
    "data_nascimento": "2000-01-15",
    "curso_id": 1,
    "turno": "MATUTINO",
    "rg": "1234567",
    "sexo": "FEMININO",
    "deficiencia": "NAO",
    "idade": 24,
    "nome_mae": "Maria Teste",
    "cep": "74000000",
    "rua": "Rua Teste",
    "numero": "100",
    "bairro": "Centro",
    "cidade": "Goiânia",
    "estado": "GO",
    "raca_cor": "PARDO",
    "renda_mensal": "1_A_2_SM",
    "pessoas_renda": "4",
    "tipo_residencia": "PROPRIA_QUITADA",
    "itens_casa": "TV,CELULAR,COMPUTADOR,INTERNET",
    "goianas_ciencia": "NAO",
    "menor_idade": false
  }'
```

### 2. Testar Listagem Pública de Cursos
```bash
curl -X GET http://localhost:3333/api/courses/public
```

### 3. Testar Listagem de Candidatos (Admin)
```bash
curl -X GET http://localhost:3333/api/candidates \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

---

## 🚀 Ordem de Implementação Sugerida

1. **Executar migrations** (5 min)
2. **Atualizar candidate.model.ts** (15 min)
3. **Criar endpoint público de cursos** (10 min)
4. **Atualizar endpoint público de candidatos** (10 min)
5. **Testar inscrição completa** (10 min)
6. **Implementar upload de documentos** (opcional, 30 min)

**Tempo total estimado:** 50 minutos (sem upload) ou 1h20min (com upload)

---

## 📞 Suporte

Se encontrar algum erro durante a implementação:

1. Verifique os logs do backend: `docker logs app_backend --tail 100`
2. Verifique se as migrations rodaram: `docker exec app_backend npx sequelize-cli db:migrate:status`
3. Verifique a estrutura da tabela: `docker exec sukatech_mysql mysql -u sukatech -psukatech123 -e "DESC sukatechdb.candidatos"`

---

## ✅ Resultado Esperado

Após implementar todas as mudanças:

- ✅ Formulário de inscrição funcionando 100%
- ✅ Dados salvos com todos os 29 campos adicionais
- ✅ Página administrativa mostrando todos os dados dos candidatos
- ✅ Cursos públicos acessíveis sem login
- ✅ Upload de documentos (opcional)

---

**Data de criação:** 13/11/2025  
**Autor:** GitHub Copilot  
**Versão:** 1.0
