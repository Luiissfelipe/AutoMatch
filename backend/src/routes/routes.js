import express from 'express';
const router = express.Router();

// ==========================================
// IMPORTAÇÕES DE CONTROLLERS
// ==========================================
import AuthController from '../controllers/AuthController.js';
import UsuarioController from '../controllers/UsuarioController.js';
import CarroController from '../controllers/CarroController.js';
import InteracaoController from '../controllers/InteracaoController.js';
import TagController from '../controllers/TagController.js';

// ==========================================
// IMPORTAÇÕES DE MIDDLEWARES
// ==========================================
import { verificarToken, apenasVendedores } from '../middlewares/auth.js';
import validarDTO from '../middlewares/validarDTO.js';

// ==========================================
// IMPORTAÇÕES DE DTOs (Schemas de Validação Zod)
// ==========================================
import { cadastroDTO, loginDTO } from '../dtos/AuthDTO.js';
import { coldStartDTO, atualizarPerfilDTO } from '../dtos/UsuarioDTO.js';
import { criarCarroDTO, atualizarCarroDTO } from '../dtos/CarroDTO.js';
import { interagirDTO } from '../dtos/InteracaoDTO.js';
import { buscarTagsDTO } from '../dtos/TagDTO.js';

// ==========================================
// ROTAS DE AUTENTICAÇÃO (Públicas)
// ==========================================
router.post('/auth/cadastrar', validarDTO(cadastroDTO), AuthController.cadastrar);
router.post('/auth/login', validarDTO(loginDTO), AuthController.login);

// ==========================================
// ROTAS DE USUÁRIO
// ==========================================
router.get('/usuarios/me', verificarToken, UsuarioController.obterPerfil);
router.put('/usuarios/me', verificarToken, validarDTO(atualizarPerfilDTO), UsuarioController.atualizarPerfil);
router.patch('/usuarios/virar-vendedor', verificarToken, UsuarioController.virarVendedor);

router.post('/usuarios/cold-start', verificarToken, validarDTO(coldStartDTO), UsuarioController.registrarColdStart);
router.get('/usuarios/recomendacoes', verificarToken, UsuarioController.obterRecomendacoes);
router.get('/usuarios/favoritos', verificarToken, UsuarioController.obterFavoritos);

// ==========================================
// ROTAS DE TAGS
// ==========================================
router.get('/tags', verificarToken, TagController.buscarTodas);

// ==========================================
// ROTAS DE CARROS
// ==========================================

router.get('/carros', verificarToken, CarroController.buscarCarros);
router.get('/carros/meus-anuncios', verificarToken, apenasVendedores, CarroController.buscarMeusAnuncios);
router.post('/carros', verificarToken, apenasVendedores, validarDTO(criarCarroDTO), CarroController.criarAnuncio);
router.put('/carros/:id', verificarToken, apenasVendedores, validarDTO(atualizarCarroDTO), CarroController.atualizarAnuncio);
router.patch('/carros/:id/status', verificarToken, apenasVendedores, CarroController.marcarComoVendido);
router.delete('/carros/:id', verificarToken, apenasVendedores, CarroController.deletarAnuncio);
router.get('/carros/:id', verificarToken, CarroController.buscarPorId);

// ==========================================
// ROTAS DE INTERAÇÕES E PESOS
// ==========================================
router.post('/interacoes/visualizar', verificarToken, validarDTO(interagirDTO), InteracaoController.registrarVisualizacao);
router.post('/interacoes/favoritar', verificarToken, validarDTO(interagirDTO), InteracaoController.registrarFavorito);
router.delete('/interacoes/favoritar/:carroId', verificarToken, InteracaoController.removerFavorito);

export default router;