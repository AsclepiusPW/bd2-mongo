const express = require('express');
const ocorrenciaRouter = express.Router();
const ocorrenciaController = require('../controller/OcorrenciaController.js');


ocorrenciaRouter.post('/', ocorrenciaController.cadastrarOcorrencia);
ocorrenciaRouter.get('/:id', ocorrenciaController.buscarOcorrencia);
ocorrenciaRouter.get('/', ocorrenciaController.listarOcorrencias);
ocorrenciaRouter.put('/:id', ocorrenciaController.editarOcorrencia);
ocorrenciaRouter.delete('/:id', ocorrenciaController.removerOcorrencia);

module.exports = ocorrenciaRouter;