const PDFDocument = require('pdfkit');
const Log = require('../models/log');

exports.relatorioMonitoramento = async (req, res) => {
  try {
    // Intervalo do mês atual
    // Busca logs apenas do mês atual, considerando o fuso de Fortaleza (UTC-3)
    const agora    = new Date();
    const inicioMes = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1, 3, 0, 0));
    const fimMes    = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth() + 1, 1, 3, 0, 0));

    const logs = await Log.find({
      createdAt: { $gte: inicioMes, $lt: fimMes },
    }).lean();

    if (logs.length === 0) {
      return res.status(404).json({ erro: 'Nenhum log encontrado para o mês atual' });
    }

    // Contagem de acessos por rota
    // Reduz o array de logs em um objeto: { '/itens': 12, '/logs': 5, ... }
    const contagemRotas = logs.reduce((acc, log) => {
      // Normaliza a rota removendo query strings (?data=..., ?nome=..., etc.)
      const rota = log.rota.split('?')[0];
      acc[rota] = (acc[rota] || 0) + 1;
      return acc;
    }, {});

    // Ordena as rotas do mais acessado para o menos acessado
    const rotasOrdenadas = Object.entries(contagemRotas)
      .sort((a, b) => b[1] - a[1]);

    // Horário de pico
    // Conta acessos por hora do dia no fuso de Fortaleza
    const contagemHoras = Array(24).fill(0);
    logs.forEach(log => {
      const hora = new Date(log.createdAt).toLocaleString('pt-BR', {
        timeZone: 'America/Fortaleza',
        hour: 'numeric',
        hour12: false,
      });
      const horaNum = parseInt(hora, 10);
      if (!isNaN(horaNum)) contagemHoras[horaNum]++;
    });

    const horaPico    = contagemHoras.indexOf(Math.max(...contagemHoras));
    const totalPico   = contagemHoras[horaPico];
    const mesNome     = agora.toLocaleString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'America/Fortaleza' });

    // Geração do PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="monitoramento.pdf"');
    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(20).font('Helvetica-Bold')
       .fillColor('#1B3A5C')
       .text('Relatório de Monitoramento', { align: 'center' });

    doc.fontSize(11).font('Helvetica')
       .fillColor('#666666')
       .text(`Período: ${mesNome.charAt(0).toUpperCase() + mesNome.slice(1)}`, { align: 'center' });

    doc.text(`Total de requisições no período: ${logs.length}`, { align: 'center' });
    doc.moveDown(0.5);

    // Linha separadora
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#CCCCCC').stroke();
    doc.moveDown();

    // Tabela de acessos por rota
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#1B3A5C')
       .text('Acessos por rota');
    doc.moveDown(0.5);

    // Cabeçalho da tabela
    const colRota   = 50;
    const colAcessos = 400;
    const colPct    = 470;
    const alturaLinha = 24;
    let y = doc.y;

    // Fundo do cabeçalho
    doc.rect(50, y, 495, alturaLinha).fill('#1B3A5C');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#FFFFFF');
    doc.text('Rota',         colRota,   y + 7, { width: 330, lineBreak: false });
    doc.text('Acessos',     colAcessos, y + 7, { width: 60,  lineBreak: false });
    doc.text('%',           colPct,     y + 7, { width: 60,  lineBreak: false });
    y += alturaLinha;

    // Linhas da tabela
    rotasOrdenadas.forEach(([rota, count], i) => {
      const fundo = i % 2 === 0 ? '#F4F8FB' : '#FFFFFF';
      const pct   = ((count / logs.length) * 100).toFixed(1);

      doc.rect(50, y, 495, alturaLinha).fill(fundo);
      doc.fontSize(9).font('Helvetica').fillColor('#333333');
      doc.text(rota,            colRota,   y + 7, { width: 330, lineBreak: false });
      doc.text(String(count),  colAcessos, y + 7, { width: 60,  lineBreak: false });
      doc.text(`${pct}%`,      colPct,     y + 7, { width: 60,  lineBreak: false });

      y += alturaLinha;

      // Adiciona nova página se necessário
      if (y > 720) {
        doc.addPage();
        y = 50;
      }
    });

    // Borda da tabela
    doc.rect(50, doc.y - (rotasOrdenadas.length * alturaLinha) - alturaLinha, 495,
      (rotasOrdenadas.length + 1) * alturaLinha)
      .strokeColor('#CCCCCC').stroke();

    doc.moveDown(2);

    // Horário de pico
    // Se não couber a seção inteira, abre nova página
    if (doc.y > 550) {
      doc.addPage();
      doc.y = 50;
    }

    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#CCCCCC').stroke();
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').fillColor('#1B3A5C')
       .text('Horario de pico de uso', 50, doc.y, { width: 495, lineBreak: false });
    doc.moveDown(0.8);

    // Caixa de destaque do pico
    const yPico = doc.y;
    doc.rect(50, yPico, 495, 60).fill('#E8F4F8');
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#1B3A5C')
       .text(`Pico: ${String(horaPico).padStart(2, '0')}:00 — ${String(horaPico + 1).padStart(2, '0')}:00`, 70, yPico + 10, { lineBreak: false });
    doc.fontSize(10).font('Helvetica').fillColor('#666666')
       .text(`${totalPico} requisicoes nesse intervalo de hora`, 70, yPico + 32, { lineBreak: false });

    // Distribuição por hora — verifica se cabe o título + primeiras barras
    doc.y = yPico + 80;
    if (doc.y > 700) {
      doc.addPage();
      doc.y = 50;
    }
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1B3A5C')
       .text('Distribuicao de acessos por hora do dia:', 50, doc.y, { width: 495, lineBreak: false });
    doc.y += 20;

    const maximo   = Math.max(...contagemHoras);
    const barraMax = 280;

    contagemHoras.forEach((count, hora) => {
      if (count === 0) return;

      if (doc.y > 730) {
        doc.addPage();
        doc.y = 50;
      }

      const largura  = maximo > 0 ? Math.round((count / maximo) * barraMax) : 2;
      const yBarra   = doc.y;
      const destaque = hora === horaPico;

      doc.fontSize(9).font('Helvetica')
         .fillColor(destaque ? '#1B3A5C' : '#555555')
         .text(`${String(hora).padStart(2, '0')}h`, 50, yBarra, { width: 30, lineBreak: false });

      doc.rect(85, yBarra + 1, Math.max(largura, 2), 11)
         .fill(destaque ? '#0D7377' : '#B0C4D8');

      doc.fontSize(9).font('Helvetica').fillColor('#333333')
         .text(` ${count}`, 92 + largura, yBarra, { lineBreak: false });

      doc.y = yBarra + 16;
    });

    // Rodapé — posicionado logo após o último conteúdo
    const dataGeracao = new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' });
    doc.moveDown(1.5);
    doc.fontSize(8).font('Helvetica').fillColor('#999999')
       .text(`Gerado em: ${dataGeracao}`, 50, doc.y, { align: 'right', width: 495 });

    doc.end();
  } catch (erro) {
    console.error('[MONITORAMENTO]', erro.message);
    res.status(500).json({ erro: 'Erro ao gerar relatório de monitoramento' });
  }
};