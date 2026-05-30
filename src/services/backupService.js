const cloudinary = require('cloudinary').v2;
const Item = require('../models/item');

// Gera o conteúdo CSV dos itens
const gerarCSV = (items) => {
  const cabecalho = ['ID', 'Nome', 'Preco', 'Imagem', 'Criado em', 'Atualizado em'];

  const linhas = items.map(item => [
    item._id,
    `"${item.nome.replace(/"/g, '""')}"`,
    item.preco,
    item.imagem || '',
    new Date(item.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
    new Date(item.updatedAt).toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
  ]);

  return [cabecalho, ...linhas].map(l => l.join(',')).join('\n');
};

// Faz o upload do CSV para o Cloudinary
const uploadCSV = (conteudo, nomeArquivo) => {
  return new Promise((resolve, reject) => {
    // upload_stream envia o arquivo direto da memória, sem salvar no disco
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',          // tipo "raw" aceita qualquer formato de arquivo
        folder: 'stock-control/backups',
        public_id: nomeArquivo,
        overwrite: true,               // substitui se já existir backup do mesmo dia
      },
      (erro, resultado) => {
        if (erro) return reject(erro);
        resolve(resultado);
      }
    );

    // Converte o conteúdo CSV em buffer e envia para o stream
    const buffer = Buffer.from('\uFEFF' + conteudo, 'utf-8');
    stream.end(buffer);
  });
};

// Função principal de backup
const executarBackup = async () => {
  const agora = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Fortaleza',
    dateStyle: 'short',
  });

  console.log(`[BACKUP] Iniciando backup — ${agora}`);

  try {
    const items = await Item.find().lean();

    if (items.length === 0) {
      console.log('[BACKUP] Nenhum item encontrado. Backup cancelado.');
      return;
    }

    const csv          = gerarCSV(items);
    const data         = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const nomeArquivo  = `backup_${data}`;

    const resultado = await uploadCSV(csv, nomeArquivo);

    console.log(`[BACKUP] Concluido com sucesso!`);
    console.log(`[BACKUP] Arquivo: ${resultado.secure_url}`);
    console.log(`[BACKUP] Itens salvos: ${items.length}`);
  } catch (erro) {
    console.error('[BACKUP] Erro ao executar backup:', erro.message);
  }
};

module.exports = { executarBackup };