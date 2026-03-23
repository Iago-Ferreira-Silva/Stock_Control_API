let items = require('../data/items');

// LISTAR TODOS
exports.listar = (req, res) => {
  res.json(items);
};

// CRIAR ITEM
exports.criar = (req, res) => {
  const { nome, preco } = req.body;

  if (!nome || !preco) {
    return res.status(400).json({ erro: "Nome e preço são obrigatórios" });
  }

  const novo = {
    id: items.length ? items[items.length - 1].id + 1 : 1,
    nome,
    preco
  };

  items.push(novo);

  res.status(201).json(novo);
};

// BUSCAR POR ID
exports.buscar = (req, res) => {
  const id = Number(req.params.id);

  const item = items.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ erro: "Item não encontrado" });
  }

  res.json(item);
};

// DELETAR ITEM
exports.deletar = (req, res) => {
  const id = Number(req.params.id);

  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: "Item não encontrado" });
  }

  items.splice(index, 1);

  res.json({ msg: "Item removido com sucesso" });
};