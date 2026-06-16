class Carro {
  constructor(data) {
    this.id = data.id;
    this.modelo = data.modelo;
    this.ano = Number(data.ano);
    this.preco = Number(data.preco);
    this.urlImagem = data.urlImagem;
    this.status = data.status;
    this.favorito = data.favorito;
    this.tags = data.tags;
    


    if (data.vendedorId) {
      this.vendedorId = data.vendedorId;
    }
  }
}

export default Carro;