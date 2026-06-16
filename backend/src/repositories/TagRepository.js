import driver from '../database/neo4j.js';
import Tag from '../models/Tag.js';

class TagRepository {
  async buscarTodas() {
    const session = driver.session();
    try {
      const query = `
        MATCH (t:Tag)
        RETURN t
      `;
      const result = await session.run(query);
      
      return result.records.map(record => new Tag(record.get('t').properties));
    } finally {
      await session.close();
    }
  }
}

export default new TagRepository();