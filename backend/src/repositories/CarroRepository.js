import driver from '../database/neo4j.js';
import Carro from '../models/Carro.js';

class CarroRepository {
  async criar(carroData, vendedorId, tagsIds) {
    const session = driver.session();
    try {
      const query = `
        MATCH (v:Usuario {id: $vendedorId})
        MATCH (t:Tag)
        WHERE t.id IN $tagsIds
        WITH v, collect(DISTINCT t) AS tags
        WHERE size(tags) = size($tagsIds)
        CREATE (c:Carro {
          id: randomUUID(),
          modelo: $modelo,
          ano: $ano,
          preco: $preco,
          urlImagem: $urlImagem,
          status: "DISPONIVEL"
        })
        CREATE (v)-[:ANUNCIOU {criadoEm: datetime()}]->(c)
        WITH c, tags
        UNWIND tags AS t
        CREATE (c)-[:POSSUI_CARACTERISTICA]->(t)
        RETURN c
      `;
      const params = { ...carroData, vendedorId, tagsIds };
      const result = await session.run(query, params);
      if (result.records.length === 0) return null;
      return new Carro(result.records[0].get('c').properties);
    } finally {
      await session.close();
    }
  }

  async deletar(carroId, vendedorId) {
    const session = driver.session();
    try {
      const query = `
        MATCH (v:Usuario {id: $vendedorId})-[:ANUNCIOU]->(c:Carro {id: $carroId})
        DETACH DELETE c
      `;
      const result = await session.run(query, { carroId, vendedorId });
      return result.summary.counters.updates().nodesDeleted;
    } finally {
      await session.close();
    }
  }

  async atualizarStatus(carroId, vendedorId, novoStatus) {
    const session = driver.session();
    try {
      const query = `
        MATCH (v:Usuario {id: $vendedorId})-[:ANUNCIOU]->(c:Carro {id: $carroId})
        SET c.status = $novoStatus
        RETURN c
      `;
      const result = await session.run(query, { carroId, vendedorId, novoStatus });
      if (result.records.length === 0) return null;
      return new Carro(result.records[0].get('c').properties);
    } finally {
      await session.close();
    }
  }

  async buscarPorId(carroId, usuarioId) {
    const session = driver.session();
    try {
      const uId = usuarioId || "unauthenticated"; 

      const query = `
        MATCH (c:Carro {id: $carroId})
        OPTIONAL MATCH (c)-[:POSSUI_CARACTERISTICA]->(t:Tag)
        OPTIONAL MATCH (v:Usuario)-[:ANUNCIOU]->(c)
        WITH c, collect(t.id) AS tags, v.id AS vendedorId
        OPTIONAL MATCH (u:Usuario {id: $uId})-[fav:FAVORITOU]->(c)
        RETURN c, tags, vendedorId, fav IS NOT NULL AS favorito
      `;
      const result = await session.run(query, { carroId, uId });
      if (result.records.length === 0) return null;
      
      const record = result.records[0];
      const propriedades = record.get('c').properties;
      propriedades.tags = record.get('tags');
      propriedades.vendedorId = record.get('vendedorId');
      propriedades.favorito = record.get('favorito');
      
      return new Carro(propriedades);
    } finally {
      await session.close();
    }
  }

  async buscarTodosDisponiveis(usuarioId, limit = 12, page = 1) {
    const session = driver.session();
    try {
      const limitInt = parseInt(limit, 10);
      const pageInt = parseInt(page, 10);
      const skip = (pageInt - 1) * limitInt;
      const uId = usuarioId || "unauthenticated"; 

      const query = `
        MATCH (c:Carro {status: "DISPONIVEL"})
        OPTIONAL MATCH (c)-[:POSSUI_CARACTERISTICA]->(t:Tag)
        WITH c, collect(t.id) AS tags
        OPTIONAL MATCH (u:Usuario {id: $uId})-[fav:FAVORITOU]->(c)
        RETURN c, tags, fav IS NOT NULL AS favorito
        ORDER BY c.modelo
        SKIP toInteger($skip) 
        LIMIT toInteger($limit)
      `;
      
      const result = await session.run(query, { skip, limit: limitInt, uId });

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

  async buscarPorVendedor(vendedorId) {
    const session = driver.session();
    try {
      const query = `
        MATCH (v:Usuario {id: $vendedorId})-[:ANUNCIOU]->(c:Carro)
        OPTIONAL MATCH (c)-[:POSSUI_CARACTERISTICA]->(t:Tag)
        RETURN c, collect(t.id) AS tags
      `;
      const result = await session.run(query, { vendedorId });
      return result.records.map(record => {
        const propriedades = record.get('c').properties;
        propriedades.tags = record.get('tags');
        return new Carro(propriedades);
      });
    } finally {
      await session.close();
    }
  }

  async buscarPorFiltros(usuarioId, termo, tags, limit = 12, page = 1) {
    const session = driver.session();
    try {
      const uId = usuarioId || "unauthenticated";
      const limitInt = parseInt(limit, 10);
      const pageInt = parseInt(page, 10);
      const skip = (pageInt - 1) * limitInt;

      let query = `MATCH (c:Carro {status: "DISPONIVEL"})`;
      let whereClauses = [];
      
      if (termo) {
        whereClauses.push(`toLower(c.modelo) CONTAINS toLower($termo)`);
      }
      
      if (tags && tags.length > 0) {
        // Exige que o carro tenha todas as tags informadas.
        whereClauses.push(`ALL(tagId IN $tags WHERE (c)-[:POSSUI_CARACTERISTICA]->(:Tag {id: tagId}))`);
      }
      
      if (whereClauses.length > 0) {
        query += ` WHERE ` + whereClauses.join(` AND `);
      }
      
      query += `
        WITH DISTINCT c
        OPTIONAL MATCH (c)-[:POSSUI_CARACTERISTICA]->(t:Tag)
        WITH c, collect(t.id) AS tags
        OPTIONAL MATCH (u:Usuario {id: $uId})-[fav:FAVORITOU]->(c)
        RETURN c, tags, fav IS NOT NULL AS favorito
        ORDER BY c.modelo
        SKIP toInteger($skip) 
        LIMIT toInteger($limit)
      `;
      
      const result = await session.run(query, { termo, tags, uId, skip, limit: limitInt });
      
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

  async atualizar(carroId, vendedorId, dadosCarro, tags) {
    const session = driver.session();
    try {
      const chaves = Object.keys(dadosCarro);
      const setString = chaves.map(chave => `c.${chave} = $${chave}`).join(', ');
      
      let query = `
        MATCH (v:Usuario {id: $vendedorId})-[:ANUNCIOU]->(c:Carro {id: $carroId})
      `;
      
      if (setString) {
        query += ` SET ${setString} `;
      }
      
      if (tags && tags.length > 0) {
        query += `
          WITH c
          MATCH (t:Tag)
          WHERE t.id IN $tags
          WITH c, collect(DISTINCT t) AS novasTags
          WHERE size(novasTags) = size($tags)
          OPTIONAL MATCH (c)-[oldRel:POSSUI_CARACTERISTICA]->(:Tag)
          DELETE oldRel
          WITH c, novasTags
          UNWIND novasTags AS t
          MERGE (c)-[:POSSUI_CARACTERISTICA]->(t)
        `;
      }
      
      query += ` RETURN c`;
      
      const result = await session.run(query, { carroId, vendedorId, tags, ...dadosCarro });
      if (result.records.length === 0) return null;
      return new Carro(result.records[0].get('c').properties);
    } finally {
      await session.close();
    }
  }

  async contarCarrosDisponiveis(filtros = {}) {
  const session = driver.session();
  try {
    const { termo, tags } = filtros;
    
    let query = `MATCH (c:Carro {status: "DISPONIVEL"})`;
    let whereClauses = [];
    
    if (termo) {
      whereClauses.push(`toLower(c.modelo) CONTAINS toLower($termo)`);
    }
    
    if (tags && tags.length > 0) {
      whereClauses.push(`ALL(tagId IN $tags WHERE (c)-[:POSSUI_CARACTERISTICA]->(:Tag {id: tagId}))`);
    }
    
    if (whereClauses.length > 0) {
      query += ` WHERE ` + whereClauses.join(` AND `);
    }
    
    query += ` RETURN count(DISTINCT c) AS total`;
    
    const result = await session.run(query, { termo, tags });
    
    return result.records[0].get('total').toNumber();
  } finally {
    await session.close();
  }
}
}

export default new CarroRepository();
