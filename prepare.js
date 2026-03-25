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

async function prepareDatabase() {
  try {
    console.log('📊 Inicializando banco de dados...');

    // Execute all SQL statements
    const statements = createTablesSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await db.query(statement);
    }

    console.log('✅ Tabelas criadas/verificadas com sucesso');

    // Verificar se já existem dados
    const result = await db.query('SELECT COUNT(*) FROM clientes');
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      console.log('📝 Populando banco com dados de teste...');

      // Limpar dados existentes (seguro)
      await db.query('DELETE FROM evento_fornecedores');
      await db.query('DELETE FROM evento_servicos');
      await db.query('DELETE FROM evento_clientes');
      await db.query('DELETE FROM eventos');
      await db.query('DELETE FROM fornecedores');
      await db.query('DELETE FROM servicos');
      await db.query('DELETE FROM clientes');

      // Inserir clientes
      const clientesResult = await db.query(`
        INSERT INTO clientes (nome, email, telefone) VALUES
          ('Cliente A', 'clientea@example.com', '11999999999'),
          ('Cliente B', 'clienteb@example.com', '11988888888'),
          ('Cliente C', 'clientec@example.com', '11977777777')
        RETURNING id
      `);
      const clienteIds = clientesResult.rows.map(r => r.id);

      // Inserir fornecedores
      const fornecedoresResult = await db.query(`
        INSERT INTO fornecedores (nome, contato, email, telefone) VALUES
          ('Fornecedor A', 'João Silva', 'joao@fornecedor.com', '11966666666'),
          ('Fornecedor B', 'Maria Santos', 'maria@fornecedor.com', '11955555555'),
          ('Fornecedor C', 'Pedro Costa', 'pedro@fornecedor.com', '11944444444')
        RETURNING id
      `);
      const fornecedorIds = fornecedoresResult.rows.map(r => r.id);

      // Inserir serviços
      const servicosResult = await db.query(`
        INSERT INTO servicos (nome, descricao, preco) VALUES
          ('Fotografia', 'Sessão de fotos profissional', 500.00),
          ('Decoração', 'Decoração de eventos', 1000.00),
          ('Catering', 'Serviço de alimentação', 2000.00)
        RETURNING id
      `);
      const servicoIds = servicosResult.rows.map(r => r.id);

      // Inserir eventos
      const data = new Date().toISOString().split('T')[0];
      const evento1 = await db.query(`
        INSERT INTO eventos (nome, descricao, cor, data, hora_inicio, hora_fim) VALUES
          ('Reunião com Cliente A', 'Discutir novo projeto', '#3b82f6', $1, '09:00', '10:30')
        RETURNING id
      `, [data]);

      const evento2 = await db.query(`
        INSERT INTO eventos (nome, descricao, cor, data, hora_inicio, hora_fim) VALUES
          ('Apresentação de Serviços', 'Apresentar catálogo completo', '#22c55e', $1, '14:00', '15:00')
        RETURNING id
      `, [data]);

      const evento1Id = evento1.rows[0].id;
      const evento2Id = evento2.rows[0].id;

      // Associar clientes aos eventos
      await db.query(
        'INSERT INTO evento_clientes (evento_id, cliente_id) VALUES ($1, $2)',
        [evento1Id, clienteIds[0]]
      );
      await db.query(
        'INSERT INTO evento_clientes (evento_id, cliente_id) VALUES ($1, $2), ($1, $3), ($1, $4)',
        [evento2Id, clienteIds[0], clienteIds[1], clienteIds[2]]
      );

      // Associar serviços aos eventos
      await db.query(
        'INSERT INTO evento_servicos (evento_id, servico_id) VALUES ($1, $2)',
        [evento1Id, servicoIds[1]]
      );
      await db.query(
        'INSERT INTO evento_servicos (evento_id, servico_id) VALUES ($1, $2)',
        [evento2Id, servicoIds[0]]
      );

      // Associar fornecedores aos eventos
      await db.query(
        'INSERT INTO evento_fornecedores (evento_id, fornecedor_id) VALUES ($1, $2)',
        [evento2Id, fornecedorIds[0]]
      );

      console.log('✅ Dados de teste inseridos com sucesso');
    } else {
      console.log(`✅ Banco já contém ${count} cliente(s), pulando seed`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao preparar banco:', error.message);
    process.exit(1);
  }
}

prepareDatabase();
