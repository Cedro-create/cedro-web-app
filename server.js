import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database on startup
async function initializeDatabase() {
  try {
    console.log('📊 Testando conexão com banco...');
    await db.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    console.log('📋 Criando tabelas se necessário...');
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

    const statements = createTablesSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await db.query(statement);
    }

    console.log('✅ Tabelas criadas/verificadas com sucesso');

    // Verificar se precisa popular com dados de teste
    const result = await db.query('SELECT COUNT(*) FROM clientes');
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      console.log('📝 Populando banco com dados de teste...');
      await populateSampleData();
    } else {
      console.log(`✅ Banco já contém ${count} cliente(s)`);
    }
  } catch (error) {
    console.error('⚠️  Erro ao inicializar banco:', error.message);
    console.log('Continuando mesmo assim... (banco pode não estar disponível)');
  }
}

async function populateSampleData() {
  try {
    // Limpar dados existentes
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
    await db.query('INSERT INTO evento_clientes (evento_id, cliente_id) VALUES ($1, $2)', [evento1Id, clienteIds[0]]);
    await db.query('INSERT INTO evento_clientes (evento_id, cliente_id) VALUES ($1, $2), ($1, $3), ($1, $4)',
      [evento2Id, clienteIds[0], clienteIds[1], clienteIds[2]]);

    // Associar serviços aos eventos
    await db.query('INSERT INTO evento_servicos (evento_id, servico_id) VALUES ($1, $2)', [evento1Id, servicoIds[1]]);
    await db.query('INSERT INTO evento_servicos (evento_id, servico_id) VALUES ($1, $2)', [evento2Id, servicoIds[0]]);

    // Associar fornecedores aos eventos
    await db.query('INSERT INTO evento_fornecedores (evento_id, fornecedor_id) VALUES ($1, $2)', [evento2Id, fornecedorIds[0]]);

    console.log('✅ Dados de teste inseridos com sucesso');
  } catch (error) {
    console.error('⚠️  Erro ao popular dados:', error.message);
  }
}

// Inicializar banco na startup
initializeDatabase();

// ============ CLIENTES ============

app.get('/api/clientes', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM clientes ORDER BY nome');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/clientes/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM clientes WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Cliente não encontrado' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clientes', async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    const result = await db.query(
      'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, telefone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/clientes/:id', async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    const result = await db.query(
      'UPDATE clientes SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *',
      [nome, email, telefone, req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Cliente não encontrado' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/clientes/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM clientes WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Cliente não encontrado' });
      return;
    }
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ FORNECEDORES ============

app.get('/api/fornecedores', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM fornecedores ORDER BY nome');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/fornecedores/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM fornecedores WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Fornecedor não encontrado' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/fornecedores', async (req, res) => {
  try {
    const { nome, contato, email, telefone } = req.body;
    const result = await db.query(
      'INSERT INTO fornecedores (nome, contato, email, telefone) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, contato, email, telefone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/fornecedores/:id', async (req, res) => {
  try {
    const { nome, contato, email, telefone } = req.body;
    const result = await db.query(
      'UPDATE fornecedores SET nome = $1, contato = $2, email = $3, telefone = $4 WHERE id = $5 RETURNING *',
      [nome, contato, email, telefone, req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Fornecedor não encontrado' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/fornecedores/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM fornecedores WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Fornecedor não encontrado' });
      return;
    }
    res.json({ message: 'Fornecedor deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar fornecedor:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ SERVIÇOS ============

app.get('/api/servicos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM servicos ORDER BY nome');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/servicos/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM servicos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Serviço não encontrado' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/servicos', async (req, res) => {
  try {
    const { nome, descricao, preco } = req.body;
    const result = await db.query(
      'INSERT INTO servicos (nome, descricao, preco) VALUES ($1, $2, $3) RETURNING *',
      [nome, descricao, preco]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/servicos/:id', async (req, res) => {
  try {
    const { nome, descricao, preco } = req.body;
    const result = await db.query(
      'UPDATE servicos SET nome = $1, descricao = $2, preco = $3 WHERE id = $4 RETURNING *',
      [nome, descricao, preco, req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Serviço não encontrado' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/servicos/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM servicos WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Serviço não encontrado' });
      return;
    }
    res.json({ message: 'Serviço deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ EVENTOS ============

app.get('/api/eventos', async (req, res) => {
  console.log('🔵 SERVER: GET /api/eventos');
  try {
    const result = await db.query(`
      SELECT
        e.*,
        COALESCE(array_agg(DISTINCT ec.cliente_id) FILTER (WHERE ec.cliente_id IS NOT NULL), '{}') AS "clienteIds",
        COALESCE(array_agg(DISTINCT es.servico_id) FILTER (WHERE es.servico_id IS NOT NULL), '{}') AS "servicoIds",
        COALESCE(array_agg(DISTINCT ef.fornecedor_id) FILTER (WHERE ef.fornecedor_id IS NOT NULL), '{}') AS "fornecedorIds"
      FROM eventos e
      LEFT JOIN evento_clientes ec ON ec.evento_id = e.id
      LEFT JOIN evento_servicos es ON es.evento_id = e.id
      LEFT JOIN evento_fornecedores ef ON ef.evento_id = e.id
      GROUP BY e.id
      ORDER BY e.data, e.hora_inicio
    `);
    const eventos = result.rows.map(evento => ({
      ...evento,
      horaInicio: evento.hora_inicio,
      horaFim: evento.hora_fim,
      hora_inicio: undefined,
      hora_fim: undefined
    }));
    console.log('✅ SERVER: Retornando', eventos.length, 'eventos');
    res.json(eventos);
  } catch (error) {
    console.error('💥 SERVER: Erro ao buscar eventos:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/eventos/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        e.*,
        COALESCE(array_agg(DISTINCT ec.cliente_id) FILTER (WHERE ec.cliente_id IS NOT NULL), '{}') AS "clienteIds",
        COALESCE(array_agg(DISTINCT es.servico_id) FILTER (WHERE es.servico_id IS NOT NULL), '{}') AS "servicoIds",
        COALESCE(array_agg(DISTINCT ef.fornecedor_id) FILTER (WHERE ef.fornecedor_id IS NOT NULL), '{}') AS "fornecedorIds"
      FROM eventos e
      LEFT JOIN evento_clientes ec ON ec.evento_id = e.id
      LEFT JOIN evento_servicos es ON es.evento_id = e.id
      LEFT JOIN evento_fornecedores ef ON ef.evento_id = e.id
      WHERE e.id = $1
      GROUP BY e.id
    `, [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Evento não encontrado' });
      return;
    }
    const evento = result.rows[0];
    res.json({
      ...evento,
      horaInicio: evento.hora_inicio,
      horaFim: evento.hora_fim,
      hora_inicio: undefined,
      hora_fim: undefined
    });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/eventos', async (req, res) => {
  console.log('🔵 SERVER: POST /api/eventos recebido', req.body);
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const { nome, descricao, cor, data, horaInicio, horaFim, clienteIds, servicoIds, fornecedorIds } = req.body;

    // Inserir evento
    const eventoResult = await client.query(
      'INSERT INTO eventos (nome, descricao, cor, data, hora_inicio, hora_fim) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, descricao, cor, data, horaInicio, horaFim]
    );

    const eventoId = eventoResult.rows[0].id;

    // Inserir relações com clientes
    if (clienteIds && clienteIds.length > 0) {
      for (const clienteId of clienteIds) {
        await client.query(
          'INSERT INTO evento_clientes (evento_id, cliente_id) VALUES ($1, $2)',
          [eventoId, clienteId]
        );
      }
    }

    // Inserir relações com serviços
    if (servicoIds && servicoIds.length > 0) {
      for (const servicoId of servicoIds) {
        await client.query(
          'INSERT INTO evento_servicos (evento_id, servico_id) VALUES ($1, $2)',
          [eventoId, servicoId]
        );
      }
    }

    // Inserir relações com fornecedores
    if (fornecedorIds && fornecedorIds.length > 0) {
      for (const fornecedorId of fornecedorIds) {
        await client.query(
          'INSERT INTO evento_fornecedores (evento_id, fornecedor_id) VALUES ($1, $2)',
          [eventoId, fornecedorId]
        );
      }
    }

    await client.query('COMMIT');

    const eventoResposta = {
      ...eventoResult.rows[0],
      horaInicio: eventoResult.rows[0].hora_inicio,
      horaFim: eventoResult.rows[0].hora_fim,
      clienteIds: clienteIds || [],
      servicoIds: servicoIds || [],
      fornecedorIds: fornecedorIds || []
    };

    console.log('✅ SERVER: Evento criado com sucesso', eventoResposta.id, eventoResposta.nome);
    res.status(201).json(eventoResposta);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('💥 SERVER: Erro ao criar evento:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.put('/api/eventos/:id', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const { nome, descricao, cor, data, horaInicio, horaFim, clienteIds, servicoIds, fornecedorIds } = req.body;

    // Atualizar evento
    const eventoResult = await client.query(
      'UPDATE eventos SET nome = $1, descricao = $2, cor = $3, data = $4, hora_inicio = $5, hora_fim = $6 WHERE id = $7 RETURNING *',
      [nome, descricao, cor, data, horaInicio, horaFim, req.params.id]
    );

    if (eventoResult.rows.length === 0) {
      res.status(404).json({ error: 'Evento não encontrado' });
      return;
    }

    const eventoId = req.params.id;

    // Deletar relações antigas
    await client.query('DELETE FROM evento_clientes WHERE evento_id = $1', [eventoId]);
    await client.query('DELETE FROM evento_servicos WHERE evento_id = $1', [eventoId]);
    await client.query('DELETE FROM evento_fornecedores WHERE evento_id = $1', [eventoId]);

    // Inserir novas relações com clientes
    if (clienteIds && clienteIds.length > 0) {
      for (const clienteId of clienteIds) {
        await client.query(
          'INSERT INTO evento_clientes (evento_id, cliente_id) VALUES ($1, $2)',
          [eventoId, clienteId]
        );
      }
    }

    // Inserir novas relações com serviços
    if (servicoIds && servicoIds.length > 0) {
      for (const servicoId of servicoIds) {
        await client.query(
          'INSERT INTO evento_servicos (evento_id, servico_id) VALUES ($1, $2)',
          [eventoId, servicoId]
        );
      }
    }

    // Inserir novas relações com fornecedores
    if (fornecedorIds && fornecedorIds.length > 0) {
      for (const fornecedorId of fornecedorIds) {
        await client.query(
          'INSERT INTO evento_fornecedores (evento_id, fornecedor_id) VALUES ($1, $2)',
          [eventoId, fornecedorId]
        );
      }
    }

    await client.query('COMMIT');

    res.json({
      ...eventoResult.rows[0],
      horaInicio: eventoResult.rows[0].hora_inicio,
      horaFim: eventoResult.rows[0].hora_fim,
      clienteIds: clienteIds || [],
      servicoIds: servicoIds || [],
      fornecedorIds: fornecedorIds || []
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.delete('/api/eventos/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM eventos WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Evento não encontrado' });
      return;
    }
    res.json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ STATIC FILES ============

const distPath = path.join(__dirname, 'dist', 'cedros-app', 'browser');
app.use(express.static(distPath));

// Fallback para Angular routing
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
