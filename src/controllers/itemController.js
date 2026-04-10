const items = require('../data/items');

// Listar todos
exports.listar = (req, res) => {
  res.json(items);
};

// Criar item
exports.criar = (req, res) => {
  // .trim() remove espaços do início e do fim, evitando nomes como "  "
  const nome = req.body.nome?.trim();
  const preco = req.body.preco;

  if (!nome) {
    return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });
  }

  // Garante que o preço é um número positivo, não uma string ou negativo
  if (preco === undefined || typeof preco !== 'number' || preco <= 0) {
    return res.status(400).json({ erro: 'O campo "preco" deve ser um número positivo' });
  }

  const novoItem = {
    // Gera o próximo ID de forma segura — se a lista estiver vazia, começa em 1
    id: items.length > 0 ? items[items.length - 1].id + 1 : 1,
    nome,
    preco,
  };

  items.push(novoItem);

  res.status(201).json(novoItem);
};

// Buscar por ID
exports.buscar = (req, res) => {
  // req.params.id chega como string — Number() converte para número
  const id = Number(req.params.id);

  // Se o id não for um número válido (ex: /itens/abc), retorna 400
  if (isNaN(id)) {
    return res.status(400).json({ erro: 'O ID deve ser um número' });
  }

  const item = items.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ erro: 'Item não encontrado' });
  }

  res.json(item);
};

// Deletar item
exports.deletar = (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: 'O ID deve ser um número' });
  }

  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Item não encontrado' });
  }

  items.splice(index, 1);

  res.json({ mensagem: 'Item removido com sucesso' });
};