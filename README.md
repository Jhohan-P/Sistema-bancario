# Nome do Projeto

Sistema-Bancario

## Descrição

Este é um projeto para criar um aplicativo para banco em Node.js.

## Instalação

1. Clone este repositório: `git clone git@github.com:Jhohan-P/Sistema-bancario.git`
2. Entre no diretório do projeto: `cd Sistema-bancario`
3. Instale as dependências: `npm install`
4. Execute o projeto: `nodemon ./src/index.js`

## Como Usar

Para usar a API, basta enviar solicitações HTTP para os endpoints disponíveis.

### Endpoints

Aqui estão os endpoints disponíveis na API:

- `GET /contas`: Retorna uma lista de todas as contas cadastrados.
- `POST /contas`:  Cria uma nova conta com base nos dados fornecidos no corpo da solicitação.
- `POST /transacoes/depositar`: Essa rota e pra depositar um valor na conta informada com base nos dados fornecidos no corpo da solicitação.
- `PUT /contas/:numeroConta/usuario`: Atualiza as informações do usuário com o numero da conta especificado com base nos dados fornecidos no corpo da solicitação.
- `DELETE /contas/:numeroConta`: Remove uma conta com o numero da conta especificado.
- `POST /transacoes/sacar`:  Essa rota realiza um saque com base nos dados fornecidos no corpo da solicitação.
- `POST /transacoes/transferir`: Essa rota e pra transferir um valor na conta informada com base nos dados fornecidos no corpo da solicitação.
- `GET /contas/saldo`: Retorna o saldo da conta informada com base nos dados fornecidos no corpo da solicitação.
- `GET /contas/extrato`: Retorna uma lista de todas as transações  cadastradas com base nos dados fornecidos no corpo da solicitação.
Para usar a API, envie solicitações HTTP para esses endpoints usando um cliente HTTP, como o [Postman](https://www.postman.com/) ou o [cURL](https://curl.se/).

## Contribuindo

Aceitamos contribuições para este projeto! Para contribuir, siga estas etapas:

1. Fork este repositório
2. Crie uma branch com a sua feature: `git checkout -b minha-feature`
3. Faça commit das suas alterações: `git commit -m 'Minha nova feature'`
4. Faça push para a branch: `git push origin minha-feature`
5. Abra um Pull Request


## Contato

Se você tiver alguma dúvida ou sugestão sobre este projeto, sinta-se à vontade para entrar em contato comigo através do meu perfil no GitHub: [@Jhohan-P](https://github.com/Jhohan-P).
