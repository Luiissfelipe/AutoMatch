import driver from '../database/neo4j.js';

class InteracaoRepository {
  async registrarVisualizacao(usuarioId, carroId) {
    const session = driver.session();
    try {
      const dataAtual = new Date().toISOString();
      const query = `
        MATCH (u:Usuario {id: $usuarioId}), (c:Carro {id: $carroId})
        MERGE (u)-[r1:INTERAGIU]->(c)
        ON CREATE SET r1.peso = 1, r1.ultimaAtualizacao = $dataAtual
        ON MATCH SET r1.peso = r1.peso + 1, r1.ultimaAtualizacao = $dataAtual
        WITH u, c
        MATCH (c)-[:POSSUI_CARACTERISTICA]->(t:Tag)
        MERGE (u)-[r2:INTERESSADO_EM]->(t)
        ON CREATE SET r2.peso = 1, r2.ultimaAtualizacao = $dataAtual
        ON MATCH SET r2.peso = r2.peso + 1, r2.ultimaAtualizacao = $dataAtual
      `;
      await session.run(query, { usuarioId, carroId, dataAtual });
    } finally {
      await session.close();
    }
  }

  async registrarFavorito(usuarioId, carroId) {
    const session = driver.session();
    try {
      const dataAtual = new Date().toISOString();
      const query = `
        MATCH (u:Usuario {id: $usuarioId}), (c:Carro {id: $carroId})
        MERGE (u)-[fav:FAVORITOU]->(c)
        ON CREATE SET fav.criadoEm = $dataAtual
        WITH u, c
        MERGE (u)-[r1:INTERAGIU]->(c)
        ON CREATE SET r1.peso = 5, r1.ultimaAtualizacao = $dataAtual
        ON MATCH SET r1.peso = r1.peso + 5, r1.ultimaAtualizacao = $dataAtual
        WITH u, c
        MATCH (c)-[:POSSUI_CARACTERISTICA]->(t:Tag)
        MERGE (u)-[r2:INTERESSADO_EM]->(t)
        ON CREATE SET r2.peso = 3, r2.ultimaAtualizacao = $dataAtual
        ON MATCH SET r2.peso = r2.peso + 3, r2.ultimaAtualizacao = $dataAtual
      `;
      await session.run(query, { usuarioId, carroId, dataAtual });
    } finally {
      await session.close();
    }
  }

  async removerFavorito(usuarioId, carroId) {
    const session = driver.session();
    try {
      const dataAtual = new Date().toISOString();
      const query = `
        MATCH (u:Usuario {id: $usuarioId})-[fav:FAVORITOU]->(c:Carro {id: $carroId})
        DELETE fav
        WITH u, c
        MATCH (u)-[r1:INTERAGIU]->(c)
        SET r1.peso = r1.peso - 5, r1.ultimaAtualizacao = $dataAtual
        WITH u, c, r1
        MATCH (c)-[:POSSUI_CARACTERISTICA]->(t:Tag)
        MATCH (u)-[r2:INTERESSADO_EM]->(t)
        SET r2.peso = r2.peso - 3, r2.ultimaAtualizacao = $dataAtual
        WITH r1, collect(r2) AS relacoesTags
        FOREACH (_ IN CASE WHEN r1.peso <= 0 THEN [1] ELSE [] END | DELETE r1)
        FOREACH (rel IN [r IN relacoesTags WHERE r.peso <= 0] | DELETE rel)
      `;
      await session.run(query, { usuarioId, carroId, dataAtual });
    } finally {
      await session.close();
    }
  }
}

export default new InteracaoRepository();
