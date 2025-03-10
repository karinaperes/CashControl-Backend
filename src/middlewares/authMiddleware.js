const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res
      .status(401)
      .json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ erro: 'Token inválido.' });
  }
};

module.exports = authMiddleware;
