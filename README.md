# Schola

![Badge de Licença](https://img.shields.io/badge/license-MIT-blue.svg)
![Badge de Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow.svg)
![Badge de Stack](https://img.shields.io/badge/stack-React%20%2B%20tRPC%20%2B%20Drizzle-blue.svg)

Uma plataforma de gestão escolar completa e integrada, projetada para otimizar a administração de alunos, professores e processos escolares.

## 🚀 Sobre o Projeto

O **Schola** é um sistema de gerenciamento escolar (School Management System) desenvolvido para centralizar e simplificar a gestão de instituições de ensino. Nossa visão é criar um ecossistema digital que atenda todas as necessidades da comunidade escolar, desde o acompanhamento pedagógico até a gestão administrativa e financeira.

Acreditamos que a jornada acadêmica é a base para a carreira de um indivíduo. Por isso, nosso grande diferencial é o módulo do aluno, que chamamos de **"Currículo"**. Este é um espaço dinâmico onde o progresso e as conquistas do estudante são registrados, incentivando-o a compreender desde cedo a importância de construir um histórico sólido para a vida.

O projeto está sendo desenvolvido de forma modular e escalável, permitindo a adição de novas funcionalidades conforme as necessidades da comunidade.

## ✨ Funcionalidades

### 🎓 Módulo do Aluno (Fase Atual)

- **Gestão de Notas:** Lançamento e visualização de notas por matéria e período
- **Controle de Frequência:** Registro de faltas e acompanhamento da assiduidade
- **Currículo do Aluno:** Área central que consolida:
  - Histórico de notas e frequência
  - Observações e feedbacks dos professores
  - Conquistas, projetos e atividades extracurriculares
- **Comunicação:** Mural de avisos e notificações importantes

### 👨‍🏫 Módulo do Professor (Planejado)

- **Gestão de Frequência:** Controle de faltas e presença dos professores
- **Gestão Financeira:** Acompanhamento de pagamentos, holerites e informações contratuais
- **Gestão de Turmas:** Atribuição de disciplinas e turmas
- **Lançamento de Notas:** Interface para registro de avaliações e feedbacks
- _(Funcionalidades adicionais serão implementadas conforme necessidade)_

### 🔮 Próximos Módulos

A plataforma será expandida de forma incremental, adicionando novos módulos conforme as demandas da comunidade escolar, incluindo:

- Gestão administrativa
- Gestão financeira completa
- Portal dos pais/responsáveis
- Biblioteca e recursos didáticos
- E muito mais...

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript | Interface moderna e reativa com tipagem completa |
| **Full-Stack** | tRPC 11 | RPC type-safe end-to-end entre frontend e backend |
| **Backend** | Express 4 + Node.js | Servidor web robusto e escalável |
| **Banco de Dados** | MySQL/TiDB | Banco de dados relacional com suporte a transações |
| **ORM** | Drizzle ORM | Acesso a dados com type-safety e migrations automáticas |
| **Estilização** | Tailwind CSS 4 | Framework utilitário para design responsivo |
| **Componentes** | shadcn/ui | Biblioteca de componentes acessíveis e customizáveis |
| **Autenticação** | Manus OAuth | Sistema de autenticação seguro e integrado |
| **Testes** | Vitest | Framework de testes rápido e moderno |
| **Build** | Vite | Ferramenta de build ultra-rápida |

## 📦 Como Instalar e Executar

### Pré-requisitos

- **Node.js** 18+ e **pnpm** 8+
- **Git**
- Acesso a um banco de dados MySQL/TiDB (ou use o fornecido pelo Manus)

### Instalação Local

```bash
# 1. Clone o repositório
git clone https://github.com/gustavo8000br/schola.git

# 2. Navegue até o diretório do projeto
cd schola

# 3. Instale as dependências
pnpm install

# 4. Configure as variáveis de ambiente
# Crie um arquivo .env.local com as variáveis necessárias
# Veja a seção "Variáveis de Ambiente" abaixo

# 5. Execute as migrations do banco de dados
pnpm db:push

# 6. Inicie o servidor de desenvolvimento
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`.

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL=mysql://usuario:senha@localhost:3306/schola

# Autenticacao OAuth
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
JWT_SECRET=sua_chave_secreta_jwt

# Informacoes do Proprietario
OWNER_NAME=Seu Nome
OWNER_OPEN_ID=seu_open_id

# APIs Internas
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave_api_frontend

# Branding
VITE_APP_TITLE=Schola
VITE_APP_LOGO=/logo.svg

# Analytics (Opcional)
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
```

### Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia o servidor de desenvolvimento
pnpm dev:build        # Build para producao
pnpm dev:preview      # Preview do build de producao

# Banco de Dados
pnpm db:push          # Aplica migrations ao banco de dados
pnpm db:pull          # Sincroniza schema local com banco remoto
pnpm db:generate      # Gera tipos TypeScript do schema

# Testes
pnpm test             # Executa todos os testes
pnpm test:watch       # Executa testes em modo watch
pnpm test:coverage    # Gera relatorio de cobertura

# Linting e Formatacao
pnpm lint             # Verifica codigo com ESLint
pnpm format           # Formata codigo com Prettier

# Build
pnpm build            # Build para producao
```

## 📁 Estrutura do Projeto

```
schola/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários e configurações
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── App.tsx        # Componente raiz
│   └── public/            # Arquivos estáticos
├── server/                 # Backend Express + tRPC
│   ├── routers.ts         # Definição de procedures tRPC
│   ├── db.ts              # Query helpers do banco de dados
│   └── _core/             # Infraestrutura do servidor
├── drizzle/               # Schema e migrations do banco
│   └── schema.ts          # Definição das tabelas
├── shared/                # Código compartilhado
└── package.json
```

## 🗺️ Roadmap

- [x] Planejamento inicial do projeto
- [ ] **Fase 1:** Módulo do Aluno (em desenvolvimento)
  - [x] Schema do banco de dados
  - [x] Procedures tRPC básicas
  - [x] Dashboard do aluno
  - [ ] Página detalhada de notas
  - [ ] Página detalhada de frequência
  - [ ] Página do currículo
  - [ ] Testes unitários
- [ ] **Fase 2:** Módulo do Professor
  - [ ] Gestão de frequência de professores
  - [ ] Gestão financeira básica
  - [ ] Interface de lançamento de notas
- [ ] **Fase 3:** Expansão modular conforme necessidades

## 🤝 Como Contribuir

Contribuições são o que tornam a comunidade de código aberto um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1. Faça um *Fork* do projeto
2. Crie uma *Branch* para sua feature (`git checkout -b feature/MinhaFeature`)
3. Faça o *Commit* de suas mudanças (`git commit -m 'docs: Adiciona MinhaFeature'`)
4. Faça o *Push* para a Branch (`git push origin feature/MinhaFeature`)
5. Abra um *Pull Request*

### Padrão de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/) para manter o histórico limpo:

- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `docs:` para documentação
- `style:` para formatação de código
- `refactor:` para refatoração
- `test:` para testes
- `chore:` para tarefas de manutenção

## 🧪 Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Gerar relatório de cobertura
pnpm test:coverage
```

## 📚 Documentação

Para mais informações sobre o desenvolvimento, consulte:

- [Guia de Desenvolvimento](./docs/DEVELOPMENT.md) _(em breve)_
- [Arquitetura do Projeto](./docs/ARCHITECTURE.md) _(em breve)_
- [API Documentation](./docs/API.md) _(em breve)_

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

Para dúvidas, sugestões ou parcerias, entre em contato através das [issues do GitHub](https://github.com/gustavo8000br/schola/issues).

---

**Desenvolvido com 💙 para transformar a gestão escolar**
