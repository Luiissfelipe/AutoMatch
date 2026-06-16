import UsuarioRepository from '../repositories/UsuarioRepository.js';
import AuthService from './AuthService.js';
import AppError from '../utils/AppError.js';

class UsuarioService {
  async obterPerfil(usuarioId) {
    const usuario = await UsuarioRepository.buscarPorId(usuarioId);
    if (!usuario) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    delete usuario.senha;
    return usuario;
  }

  async atualizarPerfil(usuarioId, dadosAtualizacaoDTO) {
    const usuarioAtualizado = await UsuarioRepository.atualizar(usuarioId, dadosAtualizacaoDTO);
    if (!usuarioAtualizado) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    delete usuarioAtualizado.senha;
    return usuarioAtualizado;
  }

  async virarVendedor(usuarioId) {
    const usuario = await UsuarioRepository.buscarPorId(usuarioId);
    if (!usuario) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const roles = Array.from(new Set([...(usuario.roles || []), 'COMPRADOR', 'VENDEDOR']));
    const usuarioAtualizado = await UsuarioRepository.atualizar(usuarioId, { roles });
    const novoToken = AuthService.gerarToken(usuarioAtualizado);

    delete usuarioAtualizado.senha;
    return { usuario: usuarioAtualizado, token: novoToken };
  }

  async registrarColdStart(usuarioId, tagsDTO) {
    const tags = [...new Set(tagsDTO.tags)];

    const totalTagsSalvas = await UsuarioRepository.salvarTagsIniciais(usuarioId, tags);
    if (totalTagsSalvas !== tags.length) {
      throw new AppError('Uma ou mais tags informadas não existem.', 400);
    }

    const usuarioAtualizado = await UsuarioRepository.atualizar(usuarioId, { precisaOnboarding: false });
    if (!usuarioAtualizado) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    return { mensagem: 'Preferências de Cold Start salvas com sucesso.' };
  }

  async obterFavoritos(usuarioId) {
    return UsuarioRepository.buscarFavoritos(usuarioId);
  }

  async obterRecomendacoes(usuarioId, limite = 8) {
    const dataAtual = new Date();
    dataAtual.setDate(dataAtual.getDate() - 60);
    const dataCorteISO = dataAtual.toISOString();

    let estrategiaAplicada = 'FILTRAGEM_COLABORATIVA_RECENTE';
    let recomendacoes = await UsuarioRepository.recomendarCarros(usuarioId, dataCorteISO, limite);

    if (recomendacoes.length === 0) {
      estrategiaAplicada = 'FALLBACK_HISTORICO';
      recomendacoes = await UsuarioRepository.recomendarCarros(usuarioId, null, limite);
    }

    if (recomendacoes.length === 0) {
      estrategiaAplicada = 'COLD_START_TAGS';
      recomendacoes = await UsuarioRepository.recomendarPorColdStart(usuarioId, limite);
    }

    return {
      estrategiaAplicada,
      total: recomendacoes.length,
      recomendacoes
    };
  }
}

export default new UsuarioService();
