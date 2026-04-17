const PDFDocument = require('pdfkit');
const Item = require('../models/item'); // Busca do banco, não do arquivo estático

exports.gerarPDF = async (req, res) => {
  try {
    // Busca os itens reais do MongoDB antes de gerar o PDF
    const items = await Item.find();

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');

    doc.pipe(res);

    // Cabeçalho
    const dataAtual = new Date().toLocaleDateString('pt-BR', {
      timeZone: 'America/Fortaleza',
    });

    doc.fontSize(18).font('Helvetica-Bold').text('Relatório de Produtos', { align: 'center' });
    doc.fontSize(10).font('Helvetica').fillColor('grey').text(`Gerado em: ${dataAtual}`, { align: 'center' });
    doc.moveDown();

    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('grey');
    doc.moveDown(0.5);

    // Lista de itens
    if (items.length === 0) {
      doc.fillColor('black').fontSize(12).text('Nenhum produto cadastrado.', { align: 'center' });
    } else {
      doc.fillColor('black').fontSize(12);
      items.forEach((item, index) => {
        const precoFormatado = item.preco.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        doc.text(`${index + 1}. ${item.nome}  —  ${precoFormatado}`);
      });
    }

    doc.end();
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao gerar o relatório PDF' });
  }
};