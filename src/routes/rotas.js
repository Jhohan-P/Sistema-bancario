const express = require('express');

const rotas = express.Router();

const { verificaValorSenha, verificacaoCpfEmail, verificarConta, verificarNumeroDaConta, verificacaoContaSenha } = require('../middlewares/intermediarios')
const { listaDeContas, criarConta, atualizarUsuario, excluirConta, depositar, sacar, fazerTransferencia, mostrarExtrato, mostrarSaldo } = require('../controllers/fucionabilidadeDoBanco')



rotas.get('/contas', listaDeContas)
rotas.post('/contas', verificacaoCpfEmail, criarConta)
rotas.put('/contas/:numeroConta/usuario', verificarConta, atualizarUsuario)
rotas.delete('/contas/:numeroConta', verificarConta, excluirConta)
rotas.post('/transacoes/depositar', depositar)
rotas.post('/transacoes/sacar', verificaValorSenha, sacar)
rotas.post('/transacoes/transferir', verificaValorSenha, fazerTransferencia)
rotas.get('/contas/saldo', verificacaoContaSenha, verificarNumeroDaConta, mostrarSaldo)
rotas.get('/contas/extrato', verificacaoContaSenha, verificarNumeroDaConta, mostrarExtrato)


module.exports = rotas