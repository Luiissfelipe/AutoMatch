import CarroRepository from '../repositories/CarroRepository.js';
import AppError from '../utils/AppError.js';

class CarroService {
  async criarAnuncio(vendedorId, carroDTO) {
    const { tags, ...dadosCarro } = carroDTO;
    const tagsUnicas = [...new Set(tags)];

    const novoCarro = await CarroRepository.criar(dadosCarro, vendedorId, tagsUnicas);
    if (!novoCarro) {
      throw new AppError('Não foi possível criar o anúncio. Verifique vendedor e tags.', 400);
    }

    return novoCarro;
  }

  async buscarCarros(usuarioId, filtros = {}, page = 1, limit = 12) {
    const { termo, tags } = filtros;

    const limiteValido = Math.max(1, parseInt(limit) || 12);
    const paginaValida = Math.max(1, parseInt(page) || 1);
    const lista = (termo || tags)
      ? await CarroRepository.buscarPorFiltros(usuarioId, termo, tags, limiteValido, paginaValida)
      : await CarroRepository.buscarTodosDisponiveis(usuarioId, limiteValido, paginaValida);

    const total = await CarroRepository.contarCarrosDisponiveis(filtros);

    return {
      lista,
      totalRegistros: total,
      totalPaginas: Math.ceil(total / limiteValido)
    };
  }

  async buscarMeusAnuncios(vendedorId) {
    return CarroRepository.buscarPorVendedor(vendedorId);
  }

  async atualizarAnuncio(carroId, vendedorId, dadosAtualizacaoDTO) {
    const { tags, ...dadosCarro } = dadosAtualizacaoDTO;
    const tagsUnicas = tags ? [...new Set(tags)] : undefined;

    const carroAtualizado = await CarroRepository.atualizar(carroId, vendedorId, dadosCarro, tagsUnicas);

    if (!carroAtualizado) {
      throw new AppError('Veículo não encontrado ou permissão negada.', 404);
    }

    return carroAtualizado;
  }

  async marcarComoVendido(carroId, vendedorId) {
    const carroAtualizado = await CarroRepository.atualizarStatus(carroId, vendedorId, 'VENDIDO');

    if (!carroAtualizado) {
      throw new AppError('Veículo não encontrado ou permissão negada.', 404);
    }

    return carroAtualizado;
  }

  async deletarAnuncio(carroId, vendedorId) {
    const linhasAfetadas = await CarroRepository.deletar(carroId, vendedorId);

    if (linhasAfetadas === 0) {
      throw new AppError('Não foi possível excluir. Veículo não encontrado ou permissão negada.', 404);
    }

    return {
      mensagem: 'Anúncio e todos os seus vínculos foram removidos com sucesso.'
    };
  }

  async buscarPorId(carroId, usuarioId) {
    const carro = await CarroRepository.buscarPorId(carroId, usuarioId);

    if (!carro) {
      throw new AppError('Veículo não encontrado.', 404);
    }

    return carro;
  }
}

export default new CarroService();
