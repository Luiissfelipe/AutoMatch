import AuthService from '../services/AuthService.js';

class AuthController {
  async cadastrar(req, res, next) {
    try {
      const resultado = await AuthService.cadastrar(req.body);

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Usuário registrado com sucesso.',
        dados: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const resultado = await AuthService.login(email, senha);

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Login efetuado com sucesso.',
        dados: resultado
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
