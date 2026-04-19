const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.enviarCodigo = async (email, codigo) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_REMETENTE,
      to: email,
      subject: 'Seu código de verificação — Stock Control',
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
          <h2>Código de verificação</h2>
          <p>Use o código abaixo para concluir seu login:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 24px 0;">
            ${codigo}
          </div>
          <p style="color: #666; font-size: 14px;">
            Este código expira em 10 minutos.<br/>
            Se você não solicitou este código, ignore este email.
          </p>
        </div>
      `,
    });
  } catch (erro) {
    // Loga o erro real no terminal para facilitar o diagnóstico
    console.error('[EMAIL] Falha ao enviar código:', erro.message);
    // Lança um erro descritivo para o authController tratar
    throw new Error('Falha ao enviar email de verificação');
  }
};