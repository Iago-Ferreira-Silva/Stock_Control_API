const Item = require('../models/item');

exports.exportarCSV = async (req, res) => {
  try {
    const items = await Item.find().lean();
    // .lean() retorna objetos JavaScript simples em vez de documentos Mongoose
    // isso torna o processamento mais rápido pois não carrega métodos do Mongoose

    if (items.length === 0) {
      return res.status(404).json({ erro: 'Nenhum item encontrado para exportar' });
    }

    // Cabeçalho do CSV
    // Define os nomes das colunas
    const cabecalho = ['ID', 'Nome', 'Preco', 'Imagem', 'Criado em', 'Atualizado em'];

    // Linhas do CSV
    const linhas = items.map(item => [
      item._id,
      // Envolve o nome em aspas para lidar com vírgulas e caracteres especiais
      `"${item.nome.replace(/"/g, '""')}"`,
      item.preco,
      item.imagem || '',
      new Date(item.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
      new Date(item.updatedAt).toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
    ]);

    // Montagem do CSV
    // Junta cabeçalho e linhas, cada linha separada por \n
    const csv = [cabecalho, ...linhas]
      .map(linha => linha.join(','))
      .join('\n');

    // Configuração do download
    const nomeArquivo = `itens_${new Date().toISOString().split('T')[0]}.csv`;
    // Exemplo de nome: itens_2026-04-20.csv

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);

    // \uFEFF é o BOM (Byte Order Mark) — faz o Excel abrir o arquivo
    // com caracteres especiais (acentos) corretamente
    res.send('\uFEFF' + csv);

  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao exportar CSV' });
  }
};