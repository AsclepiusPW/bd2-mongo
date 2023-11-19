const mongoose = require('../database/mongoose');
const {Schema} = mongoose;

const ocorrenciaSchema = new Schema({
    titulo: String,
    data: Date,
    tipo: {
        type: String,
        enum: ['Assalto', 'Furto', 'Outros'],
        default:  'Outros' 
    },
    localizacao: {
        type: {
          type: String,
          enum: ['Point'], 
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