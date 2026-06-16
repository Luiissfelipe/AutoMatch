import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Acesso negado. Token malformado.' });
  }

  if (!process.env.JWT_SECRET) {
    return next(new AppError('JWT_SECRET não configurado.', 500));
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token invalido ou expirado. Faca login novamente.' });
  }
};

export const apenasVendedores = (req, res, next) => {
  if (!Array.isArray(req.usuario?.roles) || !req.usuario.roles.includes('VENDEDOR')) {
    return res.status(403).json({
      erro: 'Acesso restrito. Apenas usuários com perfil de VENDEDOR podem realizar esta ação.'
    });
  }

  next();
};
