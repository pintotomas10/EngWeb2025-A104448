import json

# Função que abre o dataset original
with open("dataset_reparacoes.json", "r", encoding="utf-8") as f:
    dataset = json.load(f)

reparacoesL = []
veiculosL = []
intervencoesL = []

# função que verifica os veiculos repetidos
def veiculoRep(lista, marca, modelo, matricula):
    for valor in lista:
        if valor["marca"] == marca and valor["modelo"] == modelo and valor["matricula"] == matricula:
            return True
    return False

# função que verifica se a intenvenção é repetida
def intervencaoRep(lista, codigo):
    for valor in lista:
        if valor["codigo"] == codigo:
            return True
    return False


for reparacao in dataset["reparacoes"]:

    veiculo = reparacao["viatura"]
    matricula = veiculo["matricula"]

    # Verificar se o veículo já existe na lista
    if not veiculoRep(veiculosL,  veiculo["marca"], veiculo["modelo"], matricula):
        veiculosL.append({
            "matricula": matricula,
            "marca": veiculo["marca"],
            "modelo": veiculo["modelo"]
        })

    codigoInt = []

    for intervencao in reparacao["intervencoes"]:
        codigo = intervencao["codigo"]

        codigoInt.append(codigo)

        if not intervencaoRep(intervencoesL, codigo):
            intervencoesL.append({
                "codigo": codigo,
                "nome": intervencao["nome"],
                "descricao": intervencao["descricao"]
            })

    reparacoesL.append({
        "nome": reparacao['nome'],
        "nif": reparacao['nif'],
        "data": reparacao['data'],
        "viatura": {
            "marca": veiculo['marca'],
            "modelo": veiculo['modelo'],
            "matricula": matricula
        },
        "nr_intervencoes": len(codigoInt),
        "intervencoes": codigoInt
    })

dataset = {
    "reparacoes": reparacoesL,
    "veiculos": veiculosL,
    "intervencoes": intervencoesL
}

ficheiro_output = "reparacoes.json"

with open(ficheiro_output, "w", encoding="utf-8") as f:
    json.dump(dataset, f, indent=4, ensure_ascii=False)


