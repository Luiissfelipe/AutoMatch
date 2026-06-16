import UsuarioService from '../services/UsuarioService.js';

class UsuarioController {
  async obterPerfil(req, res, next) {
    try {
      const perfil = await UsuarioService.obterPerfil(req.usuario.id);

      return res.status(200).json({
        sucesso: true,
        dados: perfil
      });
    } catch (error) {
      next(error);
    }
  }

  async atualizarPerfil(req, res, next) {
    try {
      const perfilAtualizado = await UsuarioService.atualizarPerfil(req.usuario.id, req.body);

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Perfil atualizado com sucesso.',
        dados: perfilAtualizado
      });
    } catch (error) {
      next(error);
    }
  }

  async virarVendedor(req, res, next) {
    try {
      const perfilAtualizado = await UsuarioService.virarVendedor(req.usuario.id);

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Você agora atua como vendedor.',
        dados: perfilAtualizado.usuario,
        token: perfilAtualizado.token
      });
    } catch (error) {
      next(error);
    }
  }

  async registrarColdStart(req, res, next) {
    try {
      const resultado = await UsuarioService.registrarColdStart(req.usuario.id, req.body);

      return res.status(200).json({
        sucesso: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      next(error);
    }
  }

  async obterRecomendacoes(req, res, next) {
    try {
      const limite = req.query.limite ? parseInt(req.query.limite) : 5;
      const recomendacoes = await UsuarioService.obterRecomendacoes(req.usuario.id, limite);

      return res.status(200).json({
        sucesso: true,
        ...recomendacoes
      });
    } catch (error) {
      next(error);
    }
  }

  async obterFavoritos(req, res, next) {
    try {
      const favoritos = await UsuarioService.obterFavoritos(req.usuario.id);

      return res.status(200).json({
        sucesso: true,
        total: favoritos.length,
        dados: favoritos
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UsuarioController();
