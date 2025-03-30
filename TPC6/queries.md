# Resposta a cada uma das Querys do 1.2:

## Query 1
**Quantos registos estão na base de dados**
    db.contratos.countDocuments()

## Query 2
**Quantos registos de contratos têm o tipo de procedimento com valor "Ajuste Direto Regime Geral"**
    db.contratos.find({tipoprocedimento: "Ajuste Direto Regime Geral"})

## Query 3
**Qual a lista de entidades comunicantes (ordenada alfabeticamente e sem repetições)**
    db.contratos.distinct("entidade_comunicante")

## Query 4
**Qual a distribuição de contratos por tipo de procedimento (quantos contratos tem cada tipo de procedimento)**
    db.contratos.aggregate([
        {
            $group: {
                _id: "$tipoprocedimento",
                count: {$sum: 1}
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ])

## Query 5
**Qual o montante global por entidade comunicante (somatório dos contratos associados a uma entidade)**
    db.contratos.aggregate([
        {
            $group: {
                _id:"$entidade_comunicante",
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
