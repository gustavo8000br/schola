import mysql from 'mysql2/promise';
import crypto from 'crypto';

/**
 * Script para popular o banco de dados com usuários de teste
 * Execução: node seed-users.mjs
 */

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'schola',
});

// Dados dos usuários de teste
const testUsers = [
  {
    name: "Gustavo",
    email: "gustavo@schola.local",
    openId: "gustavo_001",
    role: "admin",
    loginMethod: "test",
    description: "Administrador do Sistema"
  },
  {
    name: "Fernanda Silva",
    email: "fernanda.silva@schola.local",
    openId: "fernanda_silva_001",
    role: "teacher",
    loginMethod: "test",
    description: "Professora de Português"
  },
  {
    name: "João Silva Santos",
    email: "joao.silva@schola.local",
    openId: "joao_silva_001",
    role: "teacher",
    loginMethod: "test",
    description: "Professor de Matemática"
  },
  {
    name: "Maria Oliveira Costa",
    email: "maria.oliveira@schola.local",
    openId: "maria_oliveira_001",
    role: "coordinator",
    loginMethod: "test",
    description: "Coordenadora Pedagógica"
  },
  {
    name: "Carlos Alberto Mendes",
    email: "carlos.mendes@schola.local",
    openId: "carlos_mendes_001",
    role: "principal",
    loginMethod: "test",
    description: "Diretor da Escola"
  },
  {
    name: "Ana Paula Ferreira",
    email: "ana.ferreira@schola.local",
    openId: "ana_ferreira_001",
    role: "student",
    loginMethod: "test",
    description: "Aluna do 1º Ano A"
  },
  {
    name: "Pedro Henrique Santos",
    email: "pedro.santos@schola.local",
    openId: "pedro_santos_001",
    role: "student",
    loginMethod: "test",
    description: "Aluno do 1º Ano B"
  },
  {
    name: "Beatriz Lima Gomes",
    email: "beatriz.lima@schola.local",
    openId: "beatriz_lima_001",
    role: "student",
    loginMethod: "test",
    description: "Aluna do 2º Ano"
  },
];

// Gerar senhas aleatórias
function generatePassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function seedUsers() {
  try {
    console.log('🌱 Iniciando seed de usuários de teste...\n');

    const credentials = [];

    for (const user of testUsers) {
      const password = (user.role === "teacher" || user.role === "admin") && (user.name === "Gustavo" || user.name === "Fernanda Silva")
        ? "Padrão@2025!"
        : generatePassword();

      try {
        // Verificar se o usuário já existe
        const [existing] = await connection.query(
          'SELECT id FROM users WHERE openId = ?',
          [user.openId]
        );

        if (existing.length > 0) {
          console.log(`⏭️  Usuário ${user.name} já existe, pulando...`);
          continue;
        }

        // Inserir usuário
        const [result] = await connection.query(
          'INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())',
          [user.openId, user.name, user.email, user.loginMethod, user.role]
        );

        console.log(`✅ Usuário criado: ${user.name} (${user.role})`);

        credentials.push({
          name: user.name,
          email: user.email,
          username: user.openId,
          password: password,
          role: user.role,
          description: user.description
        });

      } catch (error) {
        console.error(`❌ Erro ao criar usuário ${user.name}:`, error.message);
      }
    }

    console.log('\n📋 Credenciais de Teste:\n');
    console.log('═'.repeat(80));

    credentials.forEach((cred, index) => {
      console.log(`\n${index + 1}. ${cred.name}`);
      console.log(`   Papel: ${cred.role.toUpperCase()}`);
      console.log(`   Descrição: ${cred.description}`);
      console.log(`   Username: ${cred.username}`);
      console.log(`   Senha: ${cred.password}`);
      console.log(`   Email: ${cred.email}`);
    });

    console.log('\n' + '═'.repeat(80));
    console.log('\n✨ Seed concluído com sucesso!');
    console.log('\n⚠️  IMPORTANTE: Guarde essas credenciais em local seguro!');
    console.log('   Essas senhas são apenas para teste e devem ser alteradas em produção.\n');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    await connection.end();
  }
}

seedUsers();
