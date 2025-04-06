import json

def convert_lists_in_json(input_file, output_file, list_keys, number_keys):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for item in data:
        for key in list_keys:
            if key in item and isinstance(item[key], str):
                cleaned = item[key][2:-2]  # Remove os primeiros e últimos dois caracteres
                item[key] = [x.strip().strip("'").strip('"') for x in cleaned.split(",")]  # Divide pelo separador vírgula e remove espaços extras e aspas
        
        for key in number_keys:
            if key in item and isinstance(item[key], str):
                try:
                    item[key] = float(item[key])  # Converte para float
                except ValueError:
                    pass  # Se não for um número válido, mantém o valor original
    
    with open(output_file, 'w', encoding='utf-8', newline='\n') as f:  # Garante novas linhas padrão
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"Conversão concluída. O novo dataset foi salvo em {output_file}")

# Definição das chaves que devem ser convertidas para listas
list_keys = ["genres", "characters", "awards", "ratingsByStars", "setting"]

# Definição das chaves que devem ser convertidas para números
number_keys = ["rating", "numRatings", "bbeScore", "bbeVotes", "likedPercent", "price"]

# Caminhos dos ficheiros
input_file = "dataset.json"  # Nome do ficheiro original
output_file = "db.json"  # Nome do ficheiro corrigido

# Executar a conversão
convert_lists_in_json(input_file, output_file, list_keys, number_keys)