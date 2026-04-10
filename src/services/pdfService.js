const PDFDocument = require('pdfkit');
const items = require('../data/items');

exports.gerarPDF = (req, res) => {
  // Cria o documento PDF em memória (sem salvar em disco)
  const doc = new PDFDocument({ margin: 40 });

  // Define os cabeçalhos para que o browser entenda que é um PDF para download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');

  // "Cano" que transfere o PDF gerado direto para a resposta HTTP
  doc.pipe(res);

  // Cabeçalho do relatório
  const dataAtual = new Date().toLocaleDateString('pt-BR');

  doc.fontSize(18).font('Helvetica-Bold').text('Relatório de Produtos', { align: 'center' });
  doc.fontSize(10).font('Helvetica').fillColor('grey').text(`Gerado em: ${dataAtual}`, { align: 'center' });
  doc.moveDown();

  // Linha separadora
  doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('grey');
  doc.moveDown(0.5);

  // Lista de itens
  if (items.length === 0) {
    doc.fillColor('black').fontSize(12).text('Nenhum produto cadastrado.', { align: 'center' });
  } else {
    doc.fillColor('black').fontSize(12);
    items.forEach((item, index) => {
      // Formata o preço no padrão brasileiro: R$ 1.500,00
      const precoFormatado = item.preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      doc.text(`${index + 1}. ${item.nome}  —  ${precoFormatado}  (ID: ${item.id})`);
    });
  }

  // Fecha e envia o PDF
  doc.end();
};