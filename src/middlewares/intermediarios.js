let { banco, contas, saques, transferencias, depositos } = require('../db/bancodedados')

const verificacaoCpfEmail = (req, res, next) => {
    const { nome, cpf, email, data_nascimento, telefone, senha } = req.body
    if (!cpf || !email) {
        return res.status(400).json({ "mensagem": "O cpf e email é obrigatório!" })
    }
    if (!data_nascimento || data_nascimento == "" || !telefone || telefone == "" || !senha || senha == "" || !nome || nome == "") {
        return res.status(400).json({ "messagem": "A data de nascimento, nome, telefone e senha são obrigatório!" })
    }
    let validandoConta = contas.find((conta) => {
        return conta.usuario.cpf === cpf || conta.usuario.email === email
    });
    if (validandoConta) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" })
    }
    next()
};
const verificarConta = (req, res, next) => {
    const { numeroConta } = req.params
    let validadoConta = contas.find((conta) => {
        return conta.numero === numeroConta
    });
    if (!validadoConta) {
        return res.status(404).json({ "messagem": "Conta bancária não encontrada!" })
    }
    next()
};

const verificarNumeroDaConta = (req, res, next) => {
    const { numero_conta, senha } = req.query
    let validadoConta = contas.find((conta) => {
        return conta.numero === numero_conta
    });
    if (!validadoConta) {
        return res.status(404).json({ "messagem": "Conta bancária não encontrada!" })
    }
    if (validadoConta.usuario.senha !== senha) {
        return res.status(400).json({ "mensagem": "A senha do banco informada é inválida!" });
    }
    next()
};

const verificacaoContaSenha = (req, res, next) => {
    const { numero_conta, senha } = req.query
    if (!numero_conta || !senha) {
        return res.status(400).json({ "mensagem": "E preciso informar o numero da conta e a senha!" });
    }
    next()
};

const verificaValorSenha = (req, res, next) => {
    const { senha, valor, numero_conta } = req.body
    if (!valor) {
        return res.status(400).json({ "mensagem": "E preciso informar o valor da trasnferencia!" });
    } if (!senha) {
        return res.status(400).json({ "mensagem": "E preciso informar a senha da conta!" });
    }
    next()
};


module.exports = {
    verificacaoCpfEmail,
    verificarConta,
    verificacaoContaSenha,
    verificarNumeroDaConta,
    verificaValorSenha
}