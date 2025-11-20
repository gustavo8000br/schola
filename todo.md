# Schola - TODO

## Fase 1: Módulo do Aluno

### Funcionalidades Principais
- [ ] Sistema de Notas (lançamento e visualização)
- [ ] Controle de Frequência (faltas e assiduidade)
- [ ] Área "Currículo do Aluno" (consolidação de dados)
- [ ] Mural de Avisos e Notificações

### Estrutura de Banco de Dados
- [x] Schema para Alunos
- [x] Schema para Notas
- [x] Schema para Frequência
- [x] Schema para Currículo do Aluno
- [x] Migrations e relacionamentos

### Frontend - Páginas e Componentes
- [x] Dashboard do Aluno
- [ ] Página de Notas
- [ ] Página de Frequência
- [ ] Página do Currículo
- [x] Componentes reutilizáveis (shadcn/ui)

### Backend - Procedures tRPC
- [x] Procedures para leitura de Notas
- [x] Procedures para leitura de Frequência
- [x] Procedures para visualizar Currículo
- [x] Procedures para Avisos/Notificações
- [ ] Procedures para CRUD completo (admin)

### Testes
- [ ] Testes unitários para procedures
- [ ] Testes de integração com banco de dados
- [ ] Testes de componentes React

## Usuários de Teste

- [x] Criar usuários de teste para todos os papéis
- [x] Documentar credenciais em TEST_CREDENTIALS.md
- [x] Alterar login do owner para admin
- [x] Script seed-users.mjs criado

## Fase 2: Módulo do Professor (Planejado)

- [ ] Gestão de Frequência de Professores
- [ ] Gestão Financeira Básica
- [ ] Interface de Lançamento de Notas

## Fase 3: Expansão Modular (Planejado)

- [ ] Gestão Administrativa
- [ ] Gestão Financeira Completa
- [ ] Portal dos Pais/Responsáveis
- [ ] Biblioteca e Recursos Didáticos

## Infraestrutura e DevOps

- [ ] Configurar variáveis de ambiente
- [ ] Documentação de setup local
- [ ] CI/CD pipeline (se necessário)


## Sistema de Controle de Acesso (RBAC)

### Papéis e Hierarquia
- [x] Implementar enum de papéis (student, teacher, coordinator, principal, admin)
- [x] Atualizar schema de usuários com campo de papel
- [x] Criar tabela de permissões
- [x] Documentar hierarquia de acesso

### Procedures tRPC com RBAC
- [x] Criar middlewares de autenticação por papel
- [x] Implementar validação de permissões em procedures
- [x] Procedures para alunos (visualizar apenas seus dados)
- [x] Procedures para professores (editar notas, frequência)
- [x] Procedures para coordenadores (gerenciar turmas, visualizar relatórios)
- [x] Procedures para diretores (acesso total ao módulo do aluno + financeiro)
- [x] Procedures para admin (acesso total com 2FA)

### Autenticação de Dois Fatores (2FA)
- [x] Implementar geração de códigos TOTP
- [x] Criar tabela para armazenar secrets de 2FA
- [ ] Implementar verificação de 2FA no login (middleware)
- [x] Interface de setup de 2FA para admin
- [x] Backup codes para recuperação

### Frontend com RBAC
- [x] Componentes condicionais baseados em papel
- [x] Navegação diferente por papel
- [x] Dashboard unificado adaptativo por papel
- [ ] Páginas de admin com gerenciamento de usuários (em progresso)
- [ ] Páginas de coordenador com relatórios (em progresso)
- [ ] Páginas de professor com lançamento de notas (em progresso)
