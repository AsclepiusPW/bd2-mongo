const Ocorrencia = require('../model/Ocorrencia');

module.exports.listarOcorrencias = async function (req, res) {
    const ocorrencias = await Ocorrencia.find({},
        {titulo:true, tipo:true, data:true, localizacao:true});
    res.status(200).json(ocorrencias);
};

module.exports.cadastrarOcorrencia = async function (req, res){
    const retorno = await Ocorrencia.create(req.body);
    res.status(201).json(retorno);
}

module.exports.removerOcorrencia = async function (req, res){
    const ocorrencia = await Ocorrencia.findById(req.params.id);
    console.log(ocorrencia);
    if(!ocorrencia){
        res.status(404).json({erro: 'Ocorrência não encontrada'});
        return;
    }
    
    await Ocorrencia.findByIdAndDelete(req.params.id);
    res.status(200).json({mensagem: 'Ocorrência removida com sucesso'});
  
};

module.exports.editarOcorrencia = async function (req, res) {
    try {
        const ocorrencia = await Ocorrencia.findById(req.params.id);

        if (!ocorrencia) {
            res.status(404).json({ erro: 'Ocorrência não encontrada' });
            return;
        }

        Object.assign(ocorrencia, req.body);

        const retorno = await ocorrencia.save();

        res.status(200).json(retorno);
    } catch (error) {
        console.error('Erro ao editar ocorrência:', error);
        res.status(500).json({ erro: 'Erro interno ao editar ocorrência' });
    }
};

module.exports.buscarOcorrencia = async function (req, res) {
    const ocorrencia = await Ocorrencia.findById(req.params.id);
    
    if(!ocorrencia){
        res.status(404).json({erro: 'Ocorrência não encontrada'});
        return;
    }
    
    res.status(200).json(ocorrencia);
};