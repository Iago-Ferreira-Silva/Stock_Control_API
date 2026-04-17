const Item = require('../models/item');

// Listar todos
exports.listar = async (req, res) => {
  try {
    const { nome, precoMin, precoMax } = req.query;

    let filtro = {};

    if (nome) {
      filtro.nome = { $regex: nome, $options: 'i' };
    }

    if (precoMin || precoMax) {
      filtro.preco = {};
      if (precoMin) filtro.preco.$gte = Number(precoMin);
      if (precoMax) filtro.preco.$lte = Number(precoMax);
    }

    const items = await Item.find(filtro);

    res.json(items);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar itens' });
  }
};

// Criar item(s)
exports.criar = async (req, res) => {
  try {
    const dados = req.body;

    // Validação básica
    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ erro: 'Formato inválido' });
    }

    // Criar vários
    if (Array.isArray(dados)) {
      if (dados.length === 0) {
        return res.status(400).json({ erro: 'Array vazio' });
      }

      const itens = await Item.insertMany(dados, { runValidators: true });
      return res.status(201).json(itens);
    }

    // Criar um
    const { nome, preco } = dados;

    const novoItem = await Item.create({ nome, preco });

    res.status(201).json(novoItem);

  } catch (erro) {
    if (erro.name === 'ValidationError') {
      const mensagens = Object.values(erro.errors).map(e => e.message);
      return res.status(400).json({ erro: mensagens.join(', ') });
    }

    res.status(500).json({ erro: 'Erro ao criar item(ns)' });
  }
};

// Buscar por ID
exports.buscar = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ erro: 'Item não encontrado' });
    }

    res.json(item);
  } catch (erro) {
    if (erro.name === 'CastError') {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    res.status(500).json({ erro: 'Erro ao buscar item' });
  }
};

// Deletar item
exports.deletar = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ erro: 'Item não encontrado' });
    }

    res.json({ mensagem: 'Item removido com sucesso' });
  } catch (erro) {
    if (erro.name === 'CastError') {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    res.status(500).json({ erro: 'Erro ao deletar item' });
  }
};