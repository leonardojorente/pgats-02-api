# API de Transferências e Usuários

Esta API permite o registro, login, consulta de usuários e transferências de valores entre usuários. O objetivo é servir de base para estudos de testes e automação de APIs.

## Tecnologias
- Node.js
- Express
- Swagger (documentação)
- Banco de dados em memória (variáveis)

## Instalação

1. Clone o repositório:
   ```sh
   git clone <repo-url>
   cd pgats-02-api
   ```
2. Instale as dependências:
   ```sh
   npm install express swagger-ui-express bcryptjs
   ```

## Como rodar

- Para iniciar o servidor:
  ```sh
  node server.js
  ```
- A API estará disponível em `http://localhost:3000`
- A documentação Swagger estará em `http://localhost:3000/api-docs`

## Endpoints principais

### Registro de usuário
- `POST /users/register`
  - Body: `{ "username": "string", "password": "string", "favorecidos": ["string"] }`

### Login
- `POST /users/login`
  - Body: `{ "username": "string", "password": "string" }`

### Listar usuários
- `GET /users`

### Transferências
- `POST /transfers`
  - Body: `{ "from": "string", "to": "string", "value": number }`
- `GET /transfers`

### GraphQL Types, Queries e Mutations

Rode `npm run start-graphql` para executar a API do GraphQL e acesse a URL http://localhost:4000/graphql para acessá-la.

- **Types:**
  - `User`: username, favorecidos, saldo
  - `Transfer`: from, to, value, date
- **Queries:**
  - `users`: lista todos os usuários
  - `transfers`: lista todas as transferências (requer autenticação JWT)
- **Mutations:**
  - `registerUser(username, password, favorecidos)`: retorna User
  - `loginUser(username, password)`: retorna token + User
  - `createTransfer(from, to, value)`: retorna Transfer (requer autenticação JWT)

## Regras de negócio
- Não é permitido registrar usuários duplicados.
- Login exige usuário e senha.
- Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos.
- O saldo inicial de cada usuário é de R$ 10.000,00.

## Testes
- O arquivo `app.js` pode ser importado em ferramentas de teste como Supertest.
- Para testar a API GraphQL, importe `graphql/app.js` nos testes.

---

Para dúvidas, consulte a documentação Swagger, GraphQL Playground ou o código-fonte.

## Conceitos empregados

## Thresholds

```javascript
thresholds: {
  http_req_duration: ["p(95)<2000"],
},
```
Define que 95% das requisições devem ser respondidas em menos de 2 segundos, garantindo o desempenho mínimo esperado.

## Checks

```javascript
check(res, {
  "register status is 201": (r) => r.status === 201,
});
```
Valida se o status da resposta está correto, garantindo que cada etapa do fluxo principal foi executada com sucesso.

## Helpers

```javascript
import { generateUsername, generatePassword } from "./helpers/randomData.js";
import { login } from "./helpers/login.js";
import { BASE_URL } from "./helpers/baseURL.js";
```
Funções auxiliares para geração de dados, login e configuração da URL, facilitando o reaproveitamento e organização do código.

## Trends

```javascript
const listUsersTrend = new Trend("list_users_duration");
```
Métrica personalizada para monitorar o tempo de resposta da listagem de usuários, permitindo análise detalhada de performance.

## Faker

```javascript
password = generatePassword();
```
Utiliza a biblioteca Faker para gerar senhas aleatórias, simulando dados realistas para os testes.

## Variavel de ambiente

```javascript
import { BASE_URL } from "./helpers/baseURL.js";
const res = http.post(`${BASE_URL}/users/register`, payload, { ... });
```
Permite configurar dinamicamente a URL base da API, tornando o teste flexível para diferentes ambientes.

## Stages

```javascript
stages: [
  { duration: '3s', target: 10 },
  { duration: '10s', target: 10 },
  { duration: '2s', target: 100 },
  { duration: '3s', target: 100 },
  { duration: '5s', target: 10 },
  { duration: '5s', target: 0 },
],
```
Define a evolução da carga do teste, simulando ramp-up, picos e ramp-down de usuários virtuais.

## Reaproveitamento de resposta

```javascript
token = res.json("token");
```
O token obtido no login é reutilizado para autenticar a requisição de listagem de usuários, simulando o fluxo real.

## Uso de token de Autenticacao

```javascript
const res = http.get(`${BASE_URL}/users`, {
  headers: { Authorization: `Bearer ${token}` },
});
```
Utiliza o token JWT no header Authorization para acessar endpoints protegidos, garantindo autenticação.

## Data-Driven Testing

```javascript
const users = new SharedArray('users', function() {
  return JSON.parse(open('./data/register-user.json'));
});
```
Utiliza um arquivo JSON externo com dados de usuários, permitindo variação dos dados de entrada e tornando o teste mais robusto.

## Groups

```javascript
group("Registrar usuário", function () { ... });
group("Login do usuário", function () { ... });
```
Organiza o teste em blocos lógicos, facilitando a leitura, manutenção e análise dos resultados por etapa do fluxo.
