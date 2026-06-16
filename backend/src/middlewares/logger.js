const logger = (req, res, next) => {
  const inicio = Date.now();

  res.on('finish', () => {
    const tempoDeProcessamento = Date.now() - inicio;
    const metodo = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;

    let logColor = '\x1b[32m'; 
    if (status >= 400 && status < 500) logColor = '\x1b[33m';
    if (status >= 500) logColor = '\x1b[31m';
    const resetColor = '\x1b[0m';

    console.log(`[API-LOG] ${logColor}${metodo} ${url} - Status: ${status} - ${tempoDeProcessamento}ms${resetColor}`);
  });

  next(); 
};

export default logger;