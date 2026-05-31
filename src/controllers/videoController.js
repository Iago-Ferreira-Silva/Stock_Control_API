const fs   = require('fs');
const path = require('path');

exports.streamVideo = (req, res) => {
  const nomeArquivo = req.params.arquivo || 'demo.mp4';

  // Garante que o nome do arquivo não contém caminhos maliciosos (ex: ../../senha)
  const arquivo = path.basename(nomeArquivo);
  const caminhoVideo = path.join(__dirname, '..', '..', 'videos', arquivo);

  // Verifica se o arquivo existe
  if (!fs.existsSync(caminhoVideo)) {
    return res.status(404).json({ erro: `Vídeo "${arquivo}" não encontrado` });
  }

  const tamanhoTotal = fs.statSync(caminhoVideo).size;
  const rangeHeader  = req.headers.range;

  if (!rangeHeader) {
    // Sem Range header — envia o vídeo inteiro (útil para downloads)
    res.setHeader('Content-Length', tamanhoTotal);
    res.setHeader('Content-Type', 'video/mp4');
    fs.createReadStream(caminhoVideo).pipe(res);
    return;
  }

  // Streaming por chunks (Range Request)
  // O navegador envia: Range: bytes=0-
  // Ou para pular para o meio: Range: bytes=5000000-
  const [inicioStr, fimStr] = rangeHeader.replace('bytes=', '').split('-');

  const inicio = parseInt(inicioStr, 10);
  // Se o fim não for especificado, envia até 1MB a partir do início
  const fim    = fimStr ? parseInt(fimStr, 10) : Math.min(inicio + 1024 * 1024, tamanhoTotal - 1);
  const tamanhoChunk = fim - inicio + 1;

  // Resposta 206 = Partial Content — padrão para streaming
  res.writeHead(206, {
    'Content-Range':  `bytes ${inicio}-${fim}/${tamanhoTotal}`,
    'Accept-Ranges':  'bytes',
    'Content-Length': tamanhoChunk,
    'Content-Type':   'video/mp4',
  });

  // Lê e envia apenas o trecho solicitado
  fs.createReadStream(caminhoVideo, { start: inicio, end: fim }).pipe(res);
};

// Listar vídeos disponíveis
exports.listarVideos = (req, res) => {
  const pastaVideos = path.join(__dirname, '..', '..', 'videos');

  if (!fs.existsSync(pastaVideos)) {
    return res.json({ videos: [] });
  }

  const videos = fs.readdirSync(pastaVideos)
    .filter(f => f.endsWith('.mp4') || f.endsWith('.webm') || f.endsWith('.ogg'))
    .map(f => ({
      nome: f,
      url:  `/video/stream/${f}`,
      tamanho: `${(fs.statSync(path.join(pastaVideos, f)).size / 1024 / 1024).toFixed(2)} MB`,
    }));

  res.json({ videos });
};