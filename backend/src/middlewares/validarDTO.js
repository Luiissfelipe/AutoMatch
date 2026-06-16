import { ZodError } from 'zod';

const validarDTO = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const mensagens = error.issues.map(err => {
        const campo = err.path.join('.');
        return campo ? `${campo}: ${err.message}` : err.message;
      });

      return res.status(400).json({
        sucesso: false,
        erro: 'Falha na validação dos dados.',
        detalhes: mensagens
      });
    }

    next(error);
  }
};

export default validarDTO;
