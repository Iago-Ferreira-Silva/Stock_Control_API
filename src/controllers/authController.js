const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { email, senha } = req.body;

  if (email === "admin@email.com" && senha === "123456") {
    const token = jwt.sign({ email }, "segredo", { expiresIn: "1h" });
    return res.json({ token });
  }

  return res.status(401).json({ erro: "Credenciais inválidas" });
};