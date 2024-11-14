const db = require('../models/db');

// CRUD - Produtos Vendidos

// 1. Listar todos os produtos vendidos (ou por ID de produto)
exports.getProdutosVendidos = (req, res) => {
  const id = req.query.id;

  let query = 'SELECT * FROM produtos_vendidos';
  if (id) {
    query += ' WHERE id_produto = ?';
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// 2. Criar um novo produto vendido
exports.createProdutoVendido = (req, res) => {
  const { id_venda, id_produto, qtde_produto, desconto } = req.body;

  // Verificar se os campos obrigatórios foram passados
  if (!id_venda || !id_produto || !qtde_produto) {
    return res.status(400).json({ message: 'id_venda, id_produto e qtde_produto são obrigatórios.' });
  }

  const produtoVendido = { id_venda, id_produto, qtde_produto, desconto };

  db.query('INSERT INTO produtos_vendidos SET ?', produtoVendido, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id_produto_vendido: results.insertId, ...produtoVendido });
  });
};

// 3. Atualizar um produto vendido
exports.updateProdutoVendido = (req, res) => {
  const id_produto_vendido = req.params.id;
  const { qtde_produto, desconto } = req.body;

  // Verificar se os campos obrigatórios foram passados
  if (qtde_produto === undefined) {
    return res.status(400).json({ message: 'Quantidade de produto (qtde_produto) é obrigatória.' });
  }

  const produtoVendido = { qtde_produto, desconto };

  db.query('UPDATE produtos_vendidos SET ? WHERE id_produto_vendido = ?', [produtoVendido, id_produto_vendido], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204); // No Content
  });
};

// 4. Deletar um produto vendido
exports.deleteProdutoVendido = (req, res) => {
  const id_produto_vendido = req.params.id;

  db.query('DELETE FROM produtos_vendidos WHERE id_produto_vendido = ?', [id_produto_vendido], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204); // No Content
  });
};
