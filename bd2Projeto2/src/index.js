require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { driver } = require('./database/neo4j');
const usuarioRoutes = require('./routes/usuarioRoutes');

app.use(express.json());
app.use(cors());

const ocorrenciaRouter = require('./routes/OcorrenciaRouter');
app.use('/ocorrencias', ocorrenciaRouter);

app.use('/usuarios', usuarioRoutes);

app.listen(process.env.API_PORT, () => {
  console.log(`API rodando na porta ${process.env.API_PORT}`);
});


process.on('exit', () => {
  driver.close();
});
