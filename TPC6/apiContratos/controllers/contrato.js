var Contrato = require('../models/contrato')

module.exports.getAllContracts = () => {
    return Contrato
        .find()
        .exec()
}

module.exports.getContractById = id => {
    return Contrato
        .findById(id)
        .exec()
}

module.exports.getAllContractsFilterByEntidade = entidade => {
    return Contrato
        .find({entidade_comunicante: entidade})
        .exec()
}

module.exports.getAllContractsFilterByTipo = tipo => {
    return Contrato
        .find({tipoprocedimento: tipo})
        .exec()
}
module.exports.getAllContractsFilterByEntidadeAndTipo = (entidade,tipo) => {
    return Contrato
        .find({
            entidade_comunicante : entidade,
            tipoprocedimento: tipo
        })
        .exec()
}

module.exports.getTipos = () => {
    return Contrato
        .distinct('tipoprocedimento')
        .sort({tipoprocedimento: 1})
        .exec()
}

module.exports.insert = contr => {
    var contrToSave = new Contrato(contr)
    return contrToSave.save()
}

module.exports.update = (id,contr) => {
    return Contrato
        .findByIdAndUpdate(id,contr, {new: true})
        .exec()
}

module.exports.delete = id => {
    return Contrato
        .findByIdAndDelete(id, {new: true})
        .exec()
}

module.exports.getEntidades = () => {
    return Contrato
        .aggregate([
            {
                $group: {
                    _id:"$NIPC_entidade_comunicante",
                    nome: {$first: "$entidade_comunicante"},
                    totalMontante: {
                        $sum: {
                            $toDouble: "$precoContratual"
                            }
                        }
                    }
            },
            {
                $sort: {nome: 1}
            }
        ])
        .exec()
}

module.exports.getEntidadesID = id => {
    return Contrato
        .aggregate([
            {
                $match: { "NIPC_entidade_comunicante": Number(id) }
            },
            {
                $group: {
                    _id:"$NIPC_entidade_comunicante",
                    nome: {$first: "$entidade_comunicante"},
                    totalMontante: {
                        $sum: {
                            $toDouble: "$precoContratual"
                            }
                        }
                    }
            },
            {
                                $sort: {totalMontante: -1}
            }
        ])
        .exec()
}