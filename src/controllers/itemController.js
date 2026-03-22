let items = require('../data/items');

exports.listar = (req, res) => {
  res.json(items);
};

exports.criar = (req, res) => {
  const novo = {
    id: items.length + 1,
    nome: req.body.nome,
    preco: req.body.preco
  };

  items.push(novo);
  res.status(201).json(novo);
};

exports.deletar = (req, res) => {
  items = items.filter(i => i.id != req.params.id);
  res.json({ msg: "Item removido" });
};

exports.buscar = (req, res) => {
  const item = items.find(i => i.id == req.params.id);

  if (!item) return res.status(404).json({ erro: "Não encontrado" });

  res.json(item);
};