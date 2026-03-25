import db from './db.js';

const createTablesSQL = `
  CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT
  );

  CREATE TABLE IF NOT EXISTS fornecedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    contato TEXT,
    email TEXT,
    telefone TEXT
  );

  CREATE TABLE IF NOT EXISTS servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2)
  );

  CREATE TABLE IF NOT EXISTS eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    cor TEXT,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS evento_clientes (
    evento_id UUID REFERENCES eventos(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    PRIMARY KEY (evento_id, cliente_id)
  );

  CREATE TABLE IF NOT EXISTS evento_servicos (
    evento_id UUID REFERENCES eventos(id) ON DELETE CASCADE,
    servico_id UUID REFERENCES servicos(id) ON DELETE CASCADE,
    PRIMARY KEY (evento_id, servico_id)
  );

  CREATE TABLE IF NOT EXISTS evento_fornecedores (
    evento_id UUID REFERENCES eventos(id) ON DELETE CASCADE,
    fornecedor_id UUID REFERENCES fornecedores(id) ON DELETE CASCADE,
    PRIMARY KEY (evento_id, fornecedor_id)
  );
`;

async function initializeDatabase() {
  try {
    // Execute all SQL statements
    const statements = createTablesSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await db.query(statement);
    }

    console.log('✅ Tabelas criadas com sucesso');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
