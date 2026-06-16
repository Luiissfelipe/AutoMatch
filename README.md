# AutoMatch 🚗

O **AutoMatch** é um marketplace automotivo com um sistema de recomendação baseado em tags, desenvolvido para ajudar usuários a encontrarem veículos compatíveis com suas preferências.

O projeto é totalmente containerizado e executa três serviços principais por meio do Docker Compose:

* **Backend:** Node.js com Express
* **Frontend:** React com Vite
* **Banco de dados:** Neo4j

## 🛠️ Tecnologias utilizadas

### Backend

* Node.js
* Express
* Neo4j Driver

### Frontend

* React
* Vite
* JavaScript

### Infraestrutura

* Docker
* Docker Compose
* Neo4j

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

* [Git](https://git-scm.com/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/), com Docker Compose incluso

## 🚀 Como executar o projeto

### 1. Clone o repositório

Clone o repositório e acesse a pasta raiz do projeto:

```bash
git clone Luiissfelipe/AutoMatch
cd AutoMatch
```

### 2. Inicie os containers

Na pasta raiz do projeto, execute:

```bash
docker compose up --build
```

Na primeira execução, o Docker irá construir as imagens e baixar as dependências necessárias.

Aguarde até que todos os serviços sejam inicializados e o banco de dados Neo4j esteja saudável.

Para verificar o estado dos containers, execute:

```bash
docker compose ps
```

### 3. Popule o banco de dados

Com os containers em execução, abra outro terminal na mesma pasta e execute:

```bash
docker compose exec backend npm run seed
```

Esse comando irá inserir no Neo4j:

* Tags
* Veículos
* Relacionamentos
* Dados iniciais necessários para o funcionamento da aplicação

> O seed normalmente precisa ser executado apenas na primeira inicialização ou depois de um reset completo do banco de dados.

### 4. Acesse os serviços

Após a inicialização, os serviços estarão disponíveis nos seguintes endereços:

| Serviço       | Endereço                  |
| ------------- | ------------------------- |
| Frontend      | http://localhost:5173     |
| Backend API   | http://localhost:3001/api |
| Neo4j Browser | http://localhost:7474     |

### Credenciais do Neo4j

```text
Usuário: neo4j
Senha: SenhaSegura123
```

> As credenciais acima são destinadas ao ambiente local de desenvolvimento. Em produção, utilize variáveis de ambiente e uma senha segura.

## 🔄 Comandos de rotina

### Iniciar o projeto

Para iniciar os containers já construídos:

```bash
docker compose up
```

Para executar os containers em segundo plano:

```bash
docker compose up -d
```

### Parar o projeto

Para parar e remover os containers, mantendo os dados armazenados:

```bash
docker compose down
```

### Reconstruir os serviços

Utilize este comando quando houver mudanças no `Dockerfile`, nas dependências ou nas configurações de construção:

```bash
docker compose up --build
```

### Visualizar os logs

Para acompanhar os logs de todos os serviços em tempo real:

```bash
docker compose logs -f
```

Para visualizar os logs de apenas um serviço:

```bash
docker compose logs -f backend
```

```bash
docker compose logs -f frontend
```

```bash
docker compose logs -f neo4j
```

### Verificar o estado dos serviços

```bash
docker compose ps
```

## ⚠️ Como resetar o banco de dados

Para apagar todos os dados do Neo4j e recriar o banco desde o início, execute:

```bash
docker compose down -v
```

Caso exista uma pasta local chamada `neo4j_data`, exclua-a manualmente, se necessário.

Depois, reconstrua e inicie os containers:

```bash
docker compose up --build
```

Com os serviços em execução, abra outro terminal e execute novamente o seed:

```bash
docker compose exec backend npm run seed
```

> Atenção: o comando `docker compose down -v` remove os volumes associados ao projeto. Todos os dados armazenados no Neo4j serão apagados.

## 🔍 Solução de problemas

### Backend apresenta erro `ECONNREFUSED`

O Neo4j pode levar mais tempo para iniciar do que o backend.

O serviço tentará se reconectar automaticamente. Caso o erro persista, verifique o estado dos containers:

```bash
docker compose ps
```

Também é possível acompanhar os logs do Neo4j:

```bash
docker compose logs -f neo4j
```

Depois que o banco estiver saudável, reinicie o backend:

```bash
docker compose restart backend
```

### Frontend não exibe os dados

Verifique se:

1. O backend está em execução.
2. A API está acessível em http://localhost:3001/api.
3. O comando de seed foi executado.
4. Não existem erros no console do navegador.
5. Não existem erros nos logs do frontend ou do backend.

Consulte os logs:

```bash
docker compose logs -f frontend backend
```

### O seed não funciona

Confirme se o container do backend está em execução:

```bash
docker compose ps
```

Em seguida, tente executar novamente:

```bash
docker compose exec backend npm run seed
```

Caso os containers não estejam ativos, inicie-os primeiro:

```bash
docker compose up -d
```

### Uma porta já está sendo utilizada

Caso alguma das portas `5173`, `3001` ou `7474` esteja ocupada, encerre o processo que está utilizando a porta ou altere o mapeamento de portas no arquivo `docker-compose.yml`.

## 📌 Resumo da primeira execução

```bash
git clone Luiissfelipe/AutoMatch
cd AutoMatch
docker compose up --build
```

Em outro terminal:

```bash
docker compose exec backend npm run seed
```

Depois, acesse:

```text
http://localhost:5173
```

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos e de aprendizado.
