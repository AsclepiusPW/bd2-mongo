require('dotenv').config();
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao mongo:', error);
  }
}


module.exports = mongoose;