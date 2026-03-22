const PDFDocument = require('pdfkit');
const items = require('../data/items');

exports.gerarPDF = (req, res) => {
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');

  doc.pipe(res);

  doc.fontSize(18).text('Relatório de Produtos', { align: 'center' });
  doc.moveDown();

  items.forEach(item => {
    doc.fontSize(12).text(`ID: ${item.id} | Nome: ${item.nome} | Preço: R$${item.preco}`);
  });

  doc.end();
};