import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

export async function verificarConexao() {
  const maxRetries = Number(process.env.NEO4J_CONNECT_RETRIES || 12);
  const retryDelayMs = Number(process.env.NEO4J_CONNECT_RETRY_DELAY_MS || 5000);

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await driver.getServerInfo();
      console.log('[Neo4j] Conexao estabelecida com sucesso.');
      return;
    } catch (err) {
      const message = `[Neo4j] Tentativa ${attempt}/${maxRetries} falhou: ${err.message}`;

      if (attempt === maxRetries) {
        console.error(message);
        process.exit(1);
      }

      console.warn(`${message}. Tentando novamente em ${retryDelayMs / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
}

export default driver;
