const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuarioController');

router.post('/usuarios', usuarioController.criarUsuario);

module.exports = router;