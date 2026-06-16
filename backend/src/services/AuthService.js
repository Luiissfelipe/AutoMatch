import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import AppError from '../utils/AppError.js';

class AuthService {
  async cadastrar(dadosDTO) {
    const usuarioExistente = await UsuarioRepository.buscarPorEmail(dadosDTO.email);
    if (usuarioExistente) {
      throw new AppError('Este e-mail já existe no sistema.', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(dadosDTO.senha, salt);

    const dadosParaSalvar = {
      ...dadosDTO,
      roles: ['COMPRADOR'],
      senha: senhaHash
    };

    const novoUsuario = await UsuarioRepository.criar(dadosParaSalvar);
    const token = this.gerarToken(novoUsuario);

    delete novoUsuario.senha;

    return { token, usuario: novoUsuario };
  }

  async login(email, senhaPlana) {
    const usuario = await UsuarioRepository.buscarPorEmail(email);
    if (!usuario) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    const senhaValida = await bcrypt.compare(senhaPlana, usuario.senha);
    if (!senhaValida) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    const token = this.gerarToken(usuario);

    delete usuario.senha;

    return { token, usuario };
  }

  gerarToken(usuario) {
    if (!process.env.JWT_SECRET) {
      throw new AppError('JWT_SECRET não configurado.', 500);
    }

    const payload = {
      id: usuario.id,
      roles: usuario.roles
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
  }
}

export default new AuthService();
