const jwt = require("jsonwebtoken");

exports.verificarAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acesso negado. Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token
    if (!decoded.isAdmin) {
      return res
        .status(403)
        .json({ error: "Acesso negado. Você não é um administrador." });
    }
    req.user = decoded; // Passa os dados do usuário para a requisição
    next(); // Continua para a próxima função
  } catch (error) {
    res.status(400).json({ error: "Token inválido." });
  }
};
