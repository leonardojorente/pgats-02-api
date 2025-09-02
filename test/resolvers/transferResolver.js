// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');

// Testes
describe('Transfer Resolver', () => {
    describe('POST /transfers', () => {

        beforeEach(async () => {
            const respostaLogin = await request('http://localhost:4000')
                .post('/graphql')
                .send({
                    "query": "mutation LoginUser($password: String!, $username: String!) { loginUser(password: $password username: $username) {user {favorecidos saldo username}token}}",
                    "variables": {
                        "username": "julio",
                        "password": "123456"
                    }
                });

            token = respostaLogin.body.data.loginUser.token;
        });

        it('a - Transferencia de sucesso', async () => {
            const resposta = await request('http://localhost:4000')
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "query": "mutation CreateTransfer($from: String!, $to: String!, $value: Float!) { createTransfer(from: $from, to: $to, value: $value) { from to value } }",
                    "variables": {
                        "from": "julio",
                        "to": "priscila",
                        "value": 1
                    }
                });

            expect(resposta.status).to.equal(200);
            expect(resposta.body.data.createTransfer.value).to.equal(1)
        });

        it('b - Sem saldo disponivel para transferencia', async () => {
            const resposta = await request('http://localhost:4000')
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "query": "mutation CreateTransfer($from: String!, $to: String!, $value: Float!) { createTransfer(from: $from, to: $to, value: $value) { from to value } }",
                    "variables": {
                        "from": "julio",
                        "to": "priscila",
                        "value": 10000
                    }
                });
            expect(resposta.status).to.equal(200);
            expect(resposta.body.errors[0]).to.have.property('message', 'Saldo insuficiente')
        });

        it('c - Token de autenticacao nao informado', async () => {
            const tokenFalho = 'ahuahuahua'
            const resposta = await request('http://localhost:4000')
                .post('/graphql')
                .set('Authorization', `Bearer ${tokenFalho}`)
                .send({
                    "query": "mutation CreateTransfer($from: String!, $to: String!, $value: Float!) { createTransfer(from: $from, to: $to, value: $value) { from to value } }",
                    "variables": {
                        "from": "julio",
                        "to": "priscila",
                        "value": 1
                    }
                });
            expect(resposta.status).to.equal(200);
            expect(resposta.body.errors[0]).to.have.property('message', 'Autenticação obrigatória')
        });

       


    });
});