import InteracaoRepository from '../repositories/InteracaoRepository.js';
import CarroRepository from '../repositories/CarroRepository.js';
import AppError from '../utils/AppError.js';

class InteracaoService {
  async registrarVisualizacao(usuarioId, interacaoDTO) {
    const { carroId } = interacaoDTO;

    const carroExiste = await CarroRepository.buscarPorId(carroId);
    if (!carroExiste) {
      throw new AppError('Não é possível registrar interação: veículo não encontrado.', 404);
    }

    await InteracaoRepository.registrarVisualizacao(usuarioId, carroId);

    return {
      mensagem: 'Visualização registrada com sucesso.',
      pesosAplicados: { carro: '+1', tags: '+1' }
    };
  }

  async registrarFavorito(usuarioId, interacaoDTO) {
    const { carroId } = interacaoDTO;

    const carroExiste = await CarroRepository.buscarPorId(carroId);
    if (!carroExiste) {
      throw new AppError('Não é possível favoritar: veículo não encontrado.', 404);
    }

    await InteracaoRepository.registrarFavorito(usuarioId, carroId);

    return {
      mensagem: 'Veículo adicionado aos favoritos com sucesso.',
      pesosAplicados: { carro: '+5', tags: '+3' }
    };
  }

  async removerFavorito(usuarioId, carroId) {
    await InteracaoRepository.removerFavorito(usuarioId, carroId);

    return { mensagem: 'Veículo removido dos favoritos.' };
  }
}

export default new InteracaoService();
