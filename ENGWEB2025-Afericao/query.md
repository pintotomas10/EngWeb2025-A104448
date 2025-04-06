# Resposta às querys pedidas

## 1. Quantos livros têm a palavra `Love` no título;
```    
    db.livros.find({title: {$regex: ".*?Love.*?"}}).count()
```    

## 2. Quais os títulos dos livros, em ordem alfabética, em que um dos autores tem apelido `Austen`?
```    
    db.livros.find({author: {$regex: ".*? Austen"}}, {title: 1, _id:0}).sort ({title: 1})
```    

## 3. Qual a lista de autores (ordenada alfabeticamente e sem repetições)? 
```    
    db.livros.distinct("author")
```    

## 4. Qual a distribuição de livros por género (`genre`) (quantos livros tem cada género)?
```    
    db.livros.aggregate([{$unwind: "$genres"},{$group: {_id: "$genres",count: {$sum: 1}}},{$sort: {count: -1}}])
```    

## 5. Quais os títulos dos livros e respetivos isbn, em ordem alfabética de título, em que um dos personagens (`characters`) é `Sirius Black`?
```    
    db.livros.find(
        { characters: "Sirius Black" },
        { title: 1, isbn: 1, _id: 0 }
    ).sort({ title: 1 })
```    