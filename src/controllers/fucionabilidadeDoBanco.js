const { randomUUID } = require('crypto');
let { banco, contas, saques, transferencias, depositos } = require('../db/bancodedados');

const { format } = require('date-fns')
const { v4: uuidv4 } = require('uuid')

const listaDeContas = (req, res) => {
    const { senha_banco } = req.query
    if (!senha_banco) {
        return res.status(400).json({ "mensagem": "A senha do banco é obrigatória!" })
    }
    if (senha_banco !== banco.senha) {
        return res.status(400).json({ "mensagem": "A senha do banco informada é inválida!" })
    }
    return res.status(200).json(contas)
};

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    let resutado = { numero: uuidv4(), saldo: 0, usuario: { ...req.body } }
    contas.push(resutado)
    return res.status(201).send()
};

const atualizarUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const { numeroConta } = req.params
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ "mensagem": "E obrigatório informar nome, cpf, data de nascimento, telefone, email e senha!" })
    }
    let validadoCpf = contas.find((conta) => { return conta.usuario.cpf == cpf });
    let validadoEmail = contas.find((conta) => { return conta.usuario.email == email });
    if (validadoCpf) {
        return res.status(400).json({ "mensagem": "O CPF informado já existe cadastrado!" })
    }
    if (validadoEmail) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o email informado!" })
    }
    let validadoConta = contas.find((conta) => { return conta.numero === numeroConta });
    validadoConta.usuario.nome = nome
    validadoConta.usuario.cpf = cpf
    validadoConta.usuario.data_nascimento = data_nascimento
    validadoConta.usuario.telefone = telefone
    validadoConta.usuario.email = email
    validadoConta.usuario.senha = senha
    return res.status(204).send()
};

const excluirConta = (req, res) => {
    const { numeroConta } = req.params
    let verificandoSaldo = contas.find((conta) => { return conta.saldo == 0 });
    if (!verificandoSaldo) {
        return res.status(403).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" })
    }
    let contasPraNaoExcluir = contas.filter((conta) => {
        return conta.numero !== numeroConta
    });
    contas = contasPraNaoExcluir
    return res.status(200).send()
};

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body
    if (!numero_conta || !valor) {
        return res.status(400).json({ "mensagem": "O número da conta e o valor são obrigatórios!" })
    } if (valor <= 0) {
        return res.status(403).json({ "mensagem": "O valor não pode ser negativo ou igual a 0!" })
    }
    let validacaoDeContaPraDepositar = contas.find((conta) => { return conta.numero === numero_conta });
    if (!validacaoDeContaPraDepositar) {
        return res.status(404).json({ "mensagem": "O número da conta informado  não existe!" });
    }
    validacaoDeContaPraDepositar.saldo += valor
    const detalhe = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    let registroDeDeposito = { "data": detalhe, "numero_conta": numero_conta, "valor": valor }
    depositos.push(registroDeDeposito)
    return res.status(204).send()
};

const sacar = (req, res) => {
    const { senha, valor, numero_conta } = req.body
    if (valor <= 0) {
        return res.status(400).json({ "mensagem": "O valor não pode ser negativo ou igual a 0!" })
    }
    let validacaoDeConta = contas.find((conta) => { return conta.numero === numero_conta });
    if (!validacaoDeConta) {
        return res.status(400).json({ "mensagem": "O número da conta informado não existe!" });
    }
    if (validacaoDeConta.usuario.senha !== senha) {
        return res.status(400).json({ "mensagem": "A senha da conta esta errada!" });
    }
    if (valor > validacaoDeConta.saldo) {
        return res.status(400).json({ "mensagem": "Saldo insuficiente!" });
    }
    validacaoDeConta.saldo -= valor
    const detalhe = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    let registroDeSaque = { "data": detalhe, "numero_conta": numero_conta, "valor": valor }
    saques.push(registroDeSaque)
    return res.status(204).send()
};

const fazerTransferencia = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    if (!numero_conta_origem) {
        return res.status(400).json({ "mensagem": "E preciso informar o numero da conta de que ira fazer a trasnferencia!" });
    }
    let validacaoDeConta = contas.find((conta) => { return conta.numero === numero_conta_origem });
    if (!validacaoDeConta) {
        return res.status(400).json({ "mensagem": "O número da conta informado não existe!" });
    }
    let validacaoDaContaPraReceberTrasnferencia = contas.find((conta) => { return conta.numero == numero_conta_destino });
    if (!validacaoDaContaPraReceberTrasnferencia) {
        return res.status(400).json({ "mensagem": "O número da conta informado pra receber a trasnferencia não existe!" });
    }
    if (validacaoDeConta.usuario.senha !== senha) {
        return res.status(400).json({ "mensagem": "A senha da conta esta errada!" });
    } if (valor > validacaoDeConta.saldo) {
        return res.status(400).json({ "mensagem": "Saldo insuficiente!" });
    }
    validacaoDeConta.saldo -= valor
    validacaoDaContaPraReceberTrasnferencia.saldo += valor
    const detalhe = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    let registroDeTransferencia = { "data": detalhe, "numero_conta_origem": numero_conta_origem, "numero_conta_destino": numero_conta_destino, "valor": valor }
    transferencias.push(registroDeTransferencia)
    return res.status(204).send()
};

const mostrarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query
    let validacaoDeConta = contas.find((conta) => {
        return conta.numero === numero_conta
    });
    return res.status(200).json({
        "saldo": validacaoDeConta.saldo
    })
};

const mostrarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query

    let depositosDaConta = depositos.filter((deposito) => {
        return deposito.numero_conta == numero_conta
    })
    let saquesDaConta = saques.filter((saques) => {
        return saques.numero_conta == numero_conta
    })
    let enviadas = transferencias.filter((enviada) => {
        return enviada.numero_conta_origem === numero_conta
    });
    let recebidas = transferencias.filter((recebida) => {
        return recebida.numero_conta_destino === numero_conta
    });
    return res.status(200).json({
        "depositos": depositosDaConta, "saques": saquesDaConta, "transferenciasEnviadas": enviadas, "transferenciasRecebidas": recebidas
    })
};
module.exports = {
    listaDeContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
    depositar,
    sacar,
    fazerTransferencia,
    mostrarSaldo,
    mostrarExtrato
};