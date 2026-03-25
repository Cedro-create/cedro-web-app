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

// Test database connection on startup
db.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully');
  }
});

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
    res.json(eventos);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
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

    res.status(201).json({
      ...eventoResult.rows[0],
      horaInicio: eventoResult.rows[0].hora_inicio,
      horaFim: eventoResult.rows[0].hora_fim,
      clienteIds: clienteIds || [],
      servicoIds: servicoIds || [],
      fornecedorIds: fornecedorIds || []
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar evento:', error);
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
