class Interacao {
  constructor(data) {
    this.peso = Number(data.peso || 1);
    
    this.ultimaAtualizacao = data.ultimaAtualizacao 
      ? new Date(data.ultimaAtualizacao).toISOString() 
      : new Date().toISOString();
  }
}

export default Interacao;