import TagService from '../services/TagService.js';

class TagController {
  
  async buscarTodas(req, res, next) {
    try {
      const tags = await TagService.buscarTodas();
      
      return res.status(200).json({
        sucesso: true,
        total: tags.length,
        dados: tags
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TagController();