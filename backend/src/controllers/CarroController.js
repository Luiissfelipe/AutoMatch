import CarroService from '../services/CarroService.js';

class CarroController {
  async buscarCarros(req, res, next) {
    try {
      const { page, limit, ...filtros } = req.query;
      const paginaAtual = Math.max(1, parseInt(page) || 1);
      const limitePorPagina = Math.max(1, parseInt(limit) || 12);

      if (filtros.tags && typeof filtros.tags === 'string') {
        filtros.tags = filtros.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }

      const resultado = await CarroService.buscarCarros(req.usuario.id, filtros, paginaAtual, limitePorPagina);

      return res.status(200).json({
        sucesso: true,
        paginacao: {
          paginaAtual,
          limitePorPagina,
          totalRegistros: resultado.totalRegistros,
          totalPaginas: resultado.totalPaginas
        },
        dados: resultado.lista
      });
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const carro = await CarroService.buscarPorId(req.params.id, req.usuario.id);

      return res.status(200).json({
        sucesso: true,
        dados: carro
      });
    } catch (error) {
      next(error);
    }
  }

  async criarAnuncio(req, res, next) {
    try {
      const novoCarro = await CarroService.criarAnuncio(req.usuario.id, req.body);

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Anúncio criado com sucesso.',
        dados: novoCarro
      });
    } catch (error) {
      next(error);
    }
  }

  async buscarMeusAnuncios(req, res, next) {
    try {
      const meusCarros = await CarroService.buscarMeusAnuncios(req.usuario.id);

      return res.status(200).json({
        sucesso: true,
        total: meusCarros.length,
        dados: meusCarros
      });
    } catch (error) {
      next(error);
    }
  }

  async atualizarAnuncio(req, res, next) {
    try {
      const carroAtualizado = await CarroService.atualizarAnuncio(req.params.id, req.usuario.id, req.body);

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Anúncio atualizado com sucesso.',
        dados: carroAtualizado
      });
    } catch (error) {
      next(error);
    }
  }

  async marcarComoVendido(req, res, next) {
    try {
      const carroVendido = await CarroService.marcarComoVendido(req.params.id, req.usuario.id);

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Veículo marcado como vendido.',
        dados: carroVendido
      });
    } catch (error) {
      next(error);
    }
  }

  async deletarAnuncio(req, res, next) {
    try {
      const resultado = await CarroService.deletarAnuncio(req.params.id, req.usuario.id);

      return res.status(200).json({
        sucesso: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CarroController();
