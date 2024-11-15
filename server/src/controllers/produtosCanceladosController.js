const db = require('../models/db');

// CRUD - Produtos Cancelados

// 1. Listar todos os Produtos Cancelados (ou por ID de produto)
exports.getProdutosCancelados = (req, res) => {
  const id = req.query.id;

  let query = 'SELECT * FROM produtos_cancelados';
  if (id) {
    query += ' WHERE id_produto_cancelado = ?';
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// 2. Criar um novo Produto Cancelado
// exports.createProdutosCancelados = (req, res) => {
//   const { id_venda, id_produto, qtde_produto, desconto } = req.body;

//   // Verificar se os campos obrigatórios foram passados
//   if (!id_venda || !id_produto || !qtde_produto) {
//     return res.status(400).json({ message: 'id_venda, id_produto e qtde_produto são obrigatórios.' });
//   }

//   const produtoVendido = { id_venda, id_produto, qtde_produto, desconto };

//   db.query('INSERT INTO produtos_vendidos SET ?', produtoVendido, (err, results) => {
//     if (err) return res.status(500).send(err);
//     res.status(201).json({ id_produto_vendido: results.insertId, ...produtoVendido });
//   });
// };

// 3. Atualizar um Produto Cancelado
exports.updateProdutosCancelados = (req, res) => {
  const id_produto_cancelado = req.params.id;
  const { qtde_produto, desconto } = req.body;

  // Verificar se os campos obrigatórios foram passados
  if (qtde_produto === undefined) {
    return res.status(400).json({ message: 'Quantidade de produto (qtde_produto) é obrigatória.' });
  }

  const produtoCancelado = { qtde_produto, desconto };

  db.query('UPDATE produtos_cancelados SET ? WHERE id_produto_cancelado = ?', [produtoCancelado, id_produto_cancelado], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204); // No Content
  });
};

// 4. Deletar um Produto Cancelado
exports.deleteProdutosCancelados = (req, res) => {
  const id_produto_cancelado = req.params.id;

  db.query('DELETE FROM produtos_cancelados WHERE id_produto_cancelado = ?', [id_produto_cancelado], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204); // No Content
  });
};
