const Usuario = require('../model/Usuario');

async function criarUsuario(req, res) {
  try {
    const { nomeDeUsuario, senha, usuarioId } = req.body;

    await Usuario.criarUsuario(nomeDeUsuario, senha, usuarioId);

    res.status(201).json({ message: 'Usuário criado com sucesso' });
    console.log("criou");
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = {
  criarUsuario,
};
