const errorHandler = (err, req, res, next) => {
  console.error(`[ERRO] ${req.method} ${req.url} >>`, err.message);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      sucesso: false,
      erro: 'Dados inválidos na requisição.',
      detalhes: err.issues.map(e => ({ campo: e.path[0], mensagem: e.message }))
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      sucesso: false,
      erro: 'Sessão inválida ou expirada. Faça login novamente.'
    });
  }

  const statusCode = err.status || 500;

  return res.status(statusCode).json({
    sucesso: false,
    erro: statusCode >= 500 ? 'Ocorreu um erro interno no servidor.' : err.message
  });
};

export default errorHandler;
