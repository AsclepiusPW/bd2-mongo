const { runCypherQuery } = require('../database/neo4j');

async function criarUsuario(nomeDeUsuario, senha, usuarioId) {
  const cypherQuery = 'CREATE (u:Usuario {nomeDeUsuario: $nomeDeUsuario, senha: $senha, usuarioId: $usuarioId}) RETURN u';
  await runCypherQuery(cypherQuery, { nomeDeUsuario, senha, usuarioId });
}

module.exports = {
  criarUsuario,
};
