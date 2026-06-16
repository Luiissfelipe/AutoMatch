import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import corsOptions from './config/cors.js';
import logger from './middlewares/logger.js'; 
import errorHandler from './middlewares/errorHandler.js';
import routes from './routes/routes.js';
import { verificarConexao } from './database/neo4j.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);
app.use('/api', routes);

app.get('/', (req, res) => {
  res.status(200).json({ mensagem: 'API do Motor de Recomendações Graph operando com sucesso.' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

await verificarConexao();

app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', `🚀 Servidor rodando na porta ${PORT}`);
});

export default app;
