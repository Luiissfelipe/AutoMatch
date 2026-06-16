import TagRepository from '../repositories/TagRepository.js';

class TagService {
  async buscarTodas() {
    const tags = await TagRepository.buscarTodas();
    return tags;
  }
}

export default new TagService();