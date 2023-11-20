const mongoose = require('../database/mongoose');
const {Schema} = mongoose;

const ocorrenciaSchema = new Schema({
    titulo: String,
    data: Date,
    tipo: String,
    localizacao: {
        type: {
          type: String,
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});

const Ocorrencia = mongoose.model('Ocorrencia', ocorrenciaSchema);

module.exports = Ocorrencia;