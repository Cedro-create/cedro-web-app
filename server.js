import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ MOCK DATA ============

let eventos = [
  {
    id: '1',
    nome: 'Reunião com Cliente A',
    descricao: 'Discutir novo projeto',
    cor: '#3b82f6',
    data: new Date().toISOString().split('T')[0],
    horaInicio: '09:00',
    horaFim: '10:30',
    clienteIds: ['1'],
    servicoIds: ['2'],
    fornecedorIds: []
  },
  {
    id: '2',
    nome: 'Apresentação de Serviços',
    descricao: 'Apresentar catálogo completo',
    cor: '#22c55e',
    data: new Date().toISOString().split('T')[0],
    horaInicio: '14:00',
    horaFim: '15:00',
    clienteIds: ['2', '3'],
    servicoIds: ['1'],
    fornecedorIds: ['1']
  }
];

let clientes = [
  { id: '1', nome: 'Cliente A', email: 'clientea@example.com', telefone: '11999999999' },
  { id: '2', nome: 'Cliente B', email: 'clienteb@example.com', telefone: '11988888888' },
  { id: '3', nome: 'Cliente C', email: 'clientec@example.com', telefone: '11977777777' }
];

let servicos = [
  { id: '1', nome: 'Fotografia', descricao: 'Sessão de fotos profissional' },
  { id: '2', nome: 'Decoração', descricao: 'Decoração de eventos' },
  { id: '3', nome: 'Catering', descricao: 'Serviço de alimentação' }
];

let fornecedores = [
  { id: '1', nome: 'Fornecedor A', descricao: 'Fornecedor de equipamentos' },
  { id: '2', nome: 'Fornecedor B', descricao: 'Fornecedor de materiais' },
  { id: '3', nome: 'Fornecedor C', descricao: 'Fornecedor de alimentos' }
];

// ============ API ROUTES ============

// EVENTOS
app.get('/api/eventos', (req, res) => {
  res.json(eventos);
});

app.get('/api/eventos/:id', (req, res) => {
  const evento = eventos.find(e => e.id === req.params.id);
  if (!evento) {
    res.status(404).json({ error: 'Evento não encontrado' });
    return;
  }
  res.json(evento);
});

app.post('/api/eventos', (req, res) => {
  const novoEvento = {
    id: String(Date.now()),
    ...req.body
  };
  eventos.push(novoEvento);
  res.status(201).json(novoEvento);
});

app.put('/api/eventos/:id', (req, res) => {
  const index = eventos.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Evento não encontrado' });
    return;
  }
  eventos[index] = { ...eventos[index], ...req.body };
  res.json(eventos[index]);
});

app.delete('/api/eventos/:id', (req, res) => {
  const index = eventos.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Evento não encontrado' });
    return;
  }
  eventos.splice(index, 1);
  res.json({ message: 'Evento deletado com sucesso' });
});

// CLIENTES
app.get('/api/clientes', (req, res) => {
  res.json(clientes);
});

app.get('/api/clientes/:id', (req, res) => {
  const cliente = clientes.find(c => c.id === req.params.id);
  if (!cliente) {
    res.status(404).json({ error: 'Cliente não encontrado' });
    return;
  }
  res.json(cliente);
});

app.post('/api/clientes', (req, res) => {
  const novoCliente = {
    id: String(Date.now()),
    ...req.body
  };
  clientes.push(novoCliente);
  res.status(201).json(novoCliente);
});

app.put('/api/clientes/:id', (req, res) => {
  const index = clientes.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Cliente não encontrado' });
    return;
  }
  clientes[index] = { ...clientes[index], ...req.body };
  res.json(clientes[index]);
});

app.delete('/api/clientes/:id', (req, res) => {
  const index = clientes.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Cliente não encontrado' });
    return;
  }
  clientes.splice(index, 1);
  res.json({ message: 'Cliente deletado com sucesso' });
});

// SERVIÇOS
app.get('/api/servicos', (req, res) => {
  res.json(servicos);
});

app.get('/api/servicos/:id', (req, res) => {
  const servico = servicos.find(s => s.id === req.params.id);
  if (!servico) {
    res.status(404).json({ error: 'Serviço não encontrado' });
    return;
  }
  res.json(servico);
});

app.post('/api/servicos', (req, res) => {
  const novoServico = {
    id: String(Date.now()),
    ...req.body
  };
  servicos.push(novoServico);
  res.status(201).json(novoServico);
});

app.put('/api/servicos/:id', (req, res) => {
  const index = servicos.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Serviço não encontrado' });
    return;
  }
  servicos[index] = { ...servicos[index], ...req.body };
  res.json(servicos[index]);
});

app.delete('/api/servicos/:id', (req, res) => {
  const index = servicos.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Serviço não encontrado' });
    return;
  }
  servicos.splice(index, 1);
  res.json({ message: 'Serviço deletado com sucesso' });
});

// FORNECEDORES
app.get('/api/fornecedores', (req, res) => {
  res.json(fornecedores);
});

app.get('/api/fornecedores/:id', (req, res) => {
  const fornecedor = fornecedores.find(f => f.id === req.params.id);
  if (!fornecedor) {
    res.status(404).json({ error: 'Fornecedor não encontrado' });
    return;
  }
  res.json(fornecedor);
});

app.post('/api/fornecedores', (req, res) => {
  const novoFornecedor = {
    id: String(Date.now()),
    ...req.body
  };
  fornecedores.push(novoFornecedor);
  res.status(201).json(novoFornecedor);
});

app.put('/api/fornecedores/:id', (req, res) => {
  const index = fornecedores.findIndex(f => f.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Fornecedor não encontrado' });
    return;
  }
  fornecedores[index] = { ...fornecedores[index], ...req.body };
  res.json(fornecedores[index]);
});

app.delete('/api/fornecedores/:id', (req, res) => {
  const index = fornecedores.findIndex(f => f.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Fornecedor não encontrado' });
    return;
  }
  fornecedores.splice(index, 1);
  res.json({ message: 'Fornecedor deletado com sucesso' });
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
