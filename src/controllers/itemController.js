const Item = require('../models/Item');

// Listar todos
exports.listar = async (req, res) => {
  try {
    // find() sem filtro retorna todos os documentos da coleção
    const items = await Item.find();
    res.json(items);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar itens' });
  }
};

// Criar item
exports.criar = async (req, res) => {
  try {
    const { nome, preco } = req.body;

    // O Mongoose já valida nome e preco pelo Schema — se faltar, cai no catch
    const novoItem = await Item.create({ nome, preco });

    res.status(201).json(novoItem);
  } catch (erro) {
    // Erro de validação do Mongoose (campo obrigatório faltando, preço negativo, etc.)
    if (erro.name === 'ValidationError') {
      const mensagens = Object.values(erro.errors).map(e => e.message);
      return res.status(400).json({ erro: mensagens.join(', ') });
    }
    res.status(500).json({ erro: 'Erro ao criar item' });
  }
};

// Buscar por ID
exports.buscar = async (req, res) => {
  try {
    // findById usa o _id do MongoDB (ex: "6627a3f...")
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ erro: 'Item não encontrado' });
    }

    res.json(item);
  } catch (erro) {
    // CastError acontece quando o ID não tem o formato válido do MongoDB
    if (erro.name === 'CastError') {
      return res.status(400).json({ erro: 'ID inválido' });
    }
    res.status(500).json({ erro: 'Erro ao buscar item' });
  }
};

// Deletar item
exports.deletar = async (req, res) => {
  try {
    // findByIdAndDelete busca e já deleta em uma operação só
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