const Item    = require('../models/item');
const { getIO } = require('../socket');

// Listar todos
exports.listar = async (req, res) => {
  try {
    const { nome, precoMin, precoMax } = req.query;
    const filtro = {};

    if (nome) filtro.nome = { $regex: nome, $options: 'i' };

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

    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ erro: 'Formato inválido' });
    }

    if (Array.isArray(dados)) {
      if (dados.length === 0) return res.status(400).json({ erro: 'Array vazio' });
      const itens = await Item.insertMany(dados, { runValidators: true });

      // Avisa todos os clientes conectados que novos itens foram criados
      getIO().emit('item:criado', itens);
      return res.status(201).json(itens);
    }

    const novoItem = await Item.create(dados);

    // Avisa todos os clientes conectados que um novo item foi criado
    getIO().emit('item:criado', novoItem);
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
    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });
    res.json(item);
  } catch (erro) {
    if (erro.name === 'CastError') return res.status(400).json({ erro: 'ID inválido' });
    res.status(500).json({ erro: 'Erro ao buscar item' });
  }
};

// Atualizar item
exports.atualizar = async (req, res) => {
  try {
    const { nome, preco } = req.body;
    const dadosAtualizados = {};

    if (nome  !== undefined) dadosAtualizados.nome  = nome.trim();
    if (preco !== undefined) dadosAtualizados.preco = preco;

    if (Object.keys(dadosAtualizados).length === 0) {
      return res.status(400).json({ erro: 'Informe ao menos um campo para atualizar' });
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      dadosAtualizados,
      { returnDocument: 'after', runValidators: true }
    );

    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

    // Avisa todos os clientes conectados que um item foi atualizado
    getIO().emit('item:atualizado', item);
    res.json(item);
  } catch (erro) {
    if (erro.name === 'CastError') return res.status(400).json({ erro: 'ID inválido' });
    if (erro.name === 'ValidationError') {
      const mensagens = Object.values(erro.errors).map(e => e.message);
      return res.status(400).json({ erro: mensagens.join(', ') });
    }
    res.status(500).json({ erro: 'Erro ao atualizar item' });
  }
};

// Deletar item
exports.deletar = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

    // Avisa todos os clientes conectados que um item foi removido
    getIO().emit('item:deletado', { id: req.params.id, nome: item.nome });
    res.json({ mensagem: 'Item removido com sucesso' });
  } catch (erro) {
    if (erro.name === 'CastError') return res.status(400).json({ erro: 'ID inválido' });
    res.status(500).json({ erro: 'Erro ao deletar item' });
  }
};

// Upload de imagem
exports.uploadImagem = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ erro: 'Nenhuma imagem foi enviada' });

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { imagem: req.file.path },
      { returnDocument: 'after' }
    );

    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });

    getIO().emit('item:atualizado', item);
    res.json({ mensagem: 'Imagem enviada com sucesso', imagem: item.imagem, item });
  } catch (erro) {
    if (erro.name === 'CastError') return res.status(400).json({ erro: 'ID inválido' });
    res.status(500).json({ erro: 'Erro ao fazer upload da imagem' });
  }
};