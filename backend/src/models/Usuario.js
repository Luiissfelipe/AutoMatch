class Usuario {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    
    if (data.senha) {
      this.senha = data.senha;
    }

    this.roles = data.roles;
    this.precisaOnboarding = data.precisaOnboarding !== undefined ? data.precisaOnboarding : true;
  }
}

export default Usuario;
