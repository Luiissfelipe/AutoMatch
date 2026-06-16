import driver from '../database/neo4j.js';
import Usuario from '../models/Usuario.js';
import Carro from '../models/Carro.js';

class UsuarioRepository {
  async criar(usuarioData) {
    const session = driver.session();
    try {
      const query = `
        CREATE (u:Usuario {
          id: randomUUID(),
          nome: $nome,
          email: $email,
          senha: $senha,
          roles: $roles,
          precisaOnboarding: true
        })
        RETURN u
      `;
      const result = await session.run(query, usuarioData);
      return new Usuario(result.records[0].get('u').properties);
    } finally {
      await session.close();
    }
  }

  async buscarPorEmail(email) {
    const session = driver.session();
    try {
      const query = `
        MATCH (u:Usuario {email: $email})
        RETURN u
      `;
      const result = await session.run(query, { email });
      
      if (result.records.length === 0) return null; 
      
      return result.records[0].get('u').properties; 
    } finally {
      await session.close();
    }
  }

  async recomendarCarros(usuarioId, dataCorte, limite) {
    const session = driver.session();
    try {
      const query = `
        MATCH (u:Usuario {id: $usuarioId})-[r:INTERESSADO_EM]->(t:Tag)<-[:POSSUI_CARACTERISTICA]-(recomendado:Carro)
        WHERE recomendado.status = "DISPONIVEL" 
          AND ($dataCorte IS NULL OR r.ultimaAtualizacao >= $dataCorte)
        WITH u, recomendado, SUM(r.peso) AS scoreRelevancia
        ORDER BY scoreRelevancia DESC
        LIMIT toInteger($limite)
        OPTIONAL MATCH (recomendado)-[:POSSUI_CARACTERISTICA]->(todasAsTags:Tag)
        WITH u, recomendado, collect(todasAsTags.id) AS tags
        OPTIONAL MATCH (u)-[fav:FAVORITOU]->(recomendado)
        RETURN recomendado, tags, fav IS NOT NULL AS favorito
      `;
      
      const result = await session.run(query, { usuarioId, dataCorte, limite });
      return result.records.map(record => {
        const propriedades = record.get('recomendado').properties;
        propriedades.tags = record.get('tags');
        propriedades.favorito = record.get('favorito');
        return new Carro(propriedades);
      });
    } finally {
      await session.close();
    }
  }

  async buscarPorId(id) {
    const session = driver.session();
    try {
      const query = `MATCH (u:Usuario {id: $id}) RETURN u`;
      const result = await session.run(query, { id });
      if (result.records.length === 0) return null;
      return new Usuario(result.records[0].get('u').properties);
    } finally {
      await session.close();
    }
  }

  async atualizar(id, dados) {
    const session = driver.session();
    try {
      const chaves = Object.keys(dados);
      const setString = chaves.map(chave => `u.${chave} = $${chave}`).join(', ');
      
      const query = `
        MATCH (u:Usuario {id: $id})
        SET ${setString}
        RETURN u
      `;
      const result = await session.run(query, { id, ...dados });
      if (result.records.length === 0) return null;
      return new Usuario(result.records[0].get('u').properties);
    } finally {
      await session.close();
    }
  }

  async salvarTagsIniciais(id, tags) {
    const session = driver.session();
    try {
      const dataAtual = new Date().toISOString(); 
      
      const query = `
        MATCH (u:Usuario {id: $id})
        MATCH (t:Tag)
        WHERE t.id IN $tags
        WITH u, collect(DISTINCT t) AS tagsEncontradas
        WHERE size(tagsEncontradas) = size($tags)
        UNWIND tagsEncontradas AS t
        MERGE (u)-[r:INTERESSADO_EM]->(t)
        ON CREATE SET r.peso = 10, r.ultimaAtualizacao = $dataAtual
        ON MATCH SET r.peso = r.peso + 10, r.ultimaAtualizacao = $dataAtual
        RETURN count(r) AS total
      `;
      
      const result = await session.run(query, { id, tags, dataAtual });
      if (result.records.length === 0) return 0;
      return result.records[0].get('total').toNumber();
    } finally {
      await session.close();
    }
  }

  async buscarFavoritos(id) {
    const session = driver.session();
    try {
      const query = `
        MATCH (u:Usuario {id: $id})-[:FAVORITOU]->(c:Carro)
        WITH c
        OPTIONAL MATCH (c)-[:POSSUI_CARACTERISTICA]->(t:Tag)
        RETURN c, collect(t.id) AS tags, true AS favorito
      `;
      const result = await session.run(query, { id });
      return result.records.map(record => {
        const propriedades = record.get('c').properties;
        propriedades.tags = record.get('tags');
        propriedades.favorito = record.get('favorito');
        return new Carro(propriedades);
      });
    } finally {
      await session.close();
    }
  }

  async recomendarPorColdStart(usuarioId, limite = 5) {
    const session = driver.session();
    try {
      const query = `
        MATCH (u:Usuario {id: $usuarioId})-[r:INTERESSADO_EM]->(t:Tag)<-[:POSSUI_CARACTERISTICA]-(recomendado:Carro)
        WHERE recomendado.status = "DISPONIVEL"
        WITH u, recomendado, SUM(r.peso) AS scoreRelevancia
        ORDER BY scoreRelevancia DESC
        LIMIT toInteger($limite)
        OPTIONAL MATCH (recomendado)-[:POSSUI_CARACTERISTICA]->(todasAsTags:Tag)
        WITH u, recomendado, collect(todasAsTags.id) AS tags
        OPTIONAL MATCH (u)-[fav:FAVORITOU]->(recomendado)
        RETURN recomendado, tags, fav IS NOT NULL AS favorito
      `;
      const result = await session.run(query, { usuarioId, limite });
      return result.records.map(record => {
        const propriedades = record.get('recomendado').properties;
        propriedades.tags = record.get('tags');
        propriedades.favorito = record.get('favorito');
        return new Carro(propriedades);
      });
    } finally {
      await session.close();
    }
  }
}

export default new UsuarioRepository();
