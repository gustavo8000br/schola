# Credenciais de Teste - Schola

Este documento contém as credenciais de teste para acessar a plataforma Schola com diferentes papéis e permissões.

## ⚠️ IMPORTANTE

Essas credenciais são **APENAS PARA TESTE E DESENVOLVIMENTO**. Em um ambiente de produção:
- Altere todas as senhas imediatamente
- Use um sistema seguro de gerenciamento de senhas
- Implemente autenticação de dois fatores (2FA) para admins
- Nunca compartilhe essas credenciais em repositórios públicos

---

## 👨‍💼 Administrador

| Campo | Valor |
| :--- | :--- |
| **Nome** | Gustavo Silva |
| **Papel** | Admin |
| **Username** | `gustavo_admin_001` |
| **Email** | gustavo@schola.local |
| **Senha** | *Gerada aleatoriamente - Veja abaixo* |
| **Acesso** | Painel de Administração Completo |

**Observação:** O administrador tem acesso total ao sistema, incluindo gerenciamento de usuários, configurações de segurança e 2FA.

---

## 👨‍🏫 Professores

### Professor 1: Português

| Campo | Valor |
| :--- | :--- |
| **Nome** | Cinthia Choquehuanca Cruz |
| **Papel** | Professor |
| **Username** | `cinthia_cruz` |
| **Email** | cinthia_cruz@schola.local |
| **Senha** | *Gerada aleatoriamente* |
| **Acesso** | Portal do Professor |

**Permissões:**
- Lançar notas dos alunos
- Registrar frequência
- Visualizar lista de alunos
- Adicionar observações

### Professor 2: Matemática

| Campo | Valor |
| :--- | :--- |
| **Nome** | João Silva Santos |
| **Papel** | Professor |
| **Username** | `joao_silva_001` |
| **Email** | joao.silva@schola.local |
| **Senha** | *Gerada aleatoriamente* |
| **Acesso** | Portal do Professor |

---

## 👩‍💼 Coordenador Pedagógico

| Campo | Valor |
| :--- | :--- |
| **Nome** | Maria Oliveira Costa |
| **Papel** | Coordenador |
| **Username** | `maria_oliveira_001` |
| **Email** | maria.oliveira@schola.local |
| **Senha** | *Gerada aleatoriamente* |
| **Acesso** | Portal do Coordenador |

**Permissões:**
- Gerenciar turmas
- Visualizar relatórios
- Gerenciar professores
- Gerenciar horários
- Visualizar desempenho geral

---

## 👨‍💼 Diretor

| Campo | Valor |
| :--- | :--- |
| **Nome** | Carlos Alberto Mendes |
| **Papel** | Diretor |
| **Username** | `carlos_mendes_001` |
| **Email** | carlos.mendes@schola.local |
| **Senha** | *Gerada aleatoriamente* |
| **Acesso** | Portal do Diretor |

**Permissões:**
- Acesso total ao módulo do aluno
- Visualizar dados financeiros
- Gerenciar usuários
- Criar avisos
- Configurações da escola

---

## 👨‍🎓 Alunos

### Aluno 1

| Campo | Valor |
| :--- | :--- |
| **Nome** | Ana Paula Ferreira |
| **Papel** | Aluno |
| **Username** | `ana_ferreira_001` |
| **Email** | ana.ferreira@schola.local |
| **Senha** | *Gerada aleatoriamente* |
| **Turma** | 1º Ano A |
| **Acesso** | Portal do Aluno |

### Aluno 2

| Campo | Valor |
| :--- | :--- |
| **Nome** | Pedro Henrique Santos |
| **Papel** | Aluno |
| **Username** | `pedro_santos_001` |
| **Email** | pedro.santos@schola.local |
| **Senha** | *Gerada aleatoriamente* |
| **Turma** | 1º Ano B |
| **Acesso** | Portal do Aluno |

### Aluno 3

| Campo | Valor |
| :--- | :--- |
| **Nome** | Beatriz Lima Gomes |
| **Papel** | Aluno |
| **Username** | `beatriz_lima_001` |
| **Email** | beatriz.lima@schola.local |
| **Senha** | *Gerada aleatoriamente* |
| **Turma** | 2º Ano |
| **Acesso** | Portal do Aluno |

**Permissões:**
- Visualizar suas notas
- Visualizar sua frequência
- Visualizar seu currículo
- Visualizar avisos

---

## 🔐 Hierarquia de Acesso

```
Aluno (1) < Professor (2) < Coordenador (3) < Diretor (4) < Admin (5)
```

Cada papel herda todas as permissões dos papéis inferiores na hierarquia.

---

## 🔄 Fluxo de Login

1. Acesse a página inicial do Schola
2. Clique em "Acessar Dashboard"
3. Você será redirecionado para o login OAuth
4. **Para testes locais:** Use o username como `openId` (ex: `gustavo_admin_001`)
5. Após autenticação, você será redirecionado para o dashboard correspondente ao seu papel

---

## 📊 Dashboards por Papel

### Dashboard do Aluno
- Visualização de notas por disciplina
- Frequência e contagem de faltas
- Currículo consolidado
- Avisos da escola

### Dashboard do Professor
- Minhas turmas
- Alunos por turma
- Ações rápidas (lançar notas, registrar frequência)
- Notas pendentes

### Dashboard do Coordenador
- Visão geral de turmas, professores e alunos
- Relatórios de desempenho
- Gerenciamento de turmas e professores
- Taxa de presença geral

### Dashboard do Diretor
- Estatísticas gerais da escola
- Relatórios executivos
- Gerenciamento de usuários
- Configurações da escola

### Painel de Administração
- Gerenciamento completo de usuários
- Configurações de 2FA
- Logs de auditoria
- Saúde do sistema

---

## 🔑 Autenticação de Dois Fatores (2FA)

O administrador deve ativar 2FA para maior segurança:

1. Acesse o Painel de Administração
2. Vá para Segurança > 2FA
3. Clique em "Ativar 2FA"
4. Escaneie o QR code com seu autenticador (Google Authenticator, Authy, etc.)
5. Insira o código de 6 dígitos para confirmar
6. Guarde os códigos de backup em local seguro

---

## 🧪 Testando Diferentes Papéis

Para testar a hierarquia de acesso:

1. **Aluno:** Pode visualizar apenas seus dados
2. **Professor:** Pode editar notas e frequência de alunos
3. **Coordenador:** Pode gerenciar turmas e visualizar relatórios
4. **Diretor:** Tem acesso total ao módulo do aluno
5. **Admin:** Tem acesso total ao sistema com 2FA

---

## 📝 Notas Importantes

- As senhas com asterisco (*Gerada aleatoriamente*) foram geradas automaticamente durante o seed
- Para obter as senhas exatas, consulte o log de execução do script `seed-users.mjs`
- Todas as contas foram criadas com `loginMethod: 'test'` para identificação
- Em produção, use um sistema de SSO (Single Sign-On) ou OAuth real

---

## 🆘 Troubleshooting

**Problema:** Não consigo fazer login
- **Solução:** Verifique se o usuário existe no banco de dados
- **Solução:** Certifique-se de que está usando o `openId` correto como username

**Problema:** Acesso negado ao acessar uma página
- **Solução:** Verifique o papel do usuário
- **Solução:** Consulte a hierarquia de acesso acima

**Problema:** 2FA não funciona
- **Solução:** Sincronize o relógio do seu dispositivo
- **Solução:** Use um código de backup se disponível

---

**Última atualização:** 25 de Novembro de 2025
**Versão:** 1.0
