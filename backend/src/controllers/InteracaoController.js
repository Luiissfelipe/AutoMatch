import InteracaoService from '../services/InteracaoService.js';

class InteracaoController {
  async registrarVisualizacao(req, res, next) {
    try {
      const resultado = await InteracaoService.registrarVisualizacao(req.usuario.id, req.body);

      return res.status(200).json({
        sucesso: true,
        mensagem: resultado.mensagem,
        pesosAplicados: resultado.pesosAplicados
      });
    } catch (error) {
      next(error);
    }
  }

  async registrarFavorito(req, res, next) {
    try {
      const resultado = await InteracaoService.registrarFavorito(req.usuario.id, req.body);

      return res.status(200).json({
        sucesso: true,
        mensagem: resultado.mensagem,
        pesosAplicados: resultado.pesosAplicados
      });
    } catch (error) {
      next(error);
    }
  }

  async removerFavorito(req, res, next) {
    try {
      const resultado = await InteracaoService.removerFavorito(req.usuario.id, req.params.carroId);

      return res.status(200).json({
        sucesso: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new InteracaoController();
