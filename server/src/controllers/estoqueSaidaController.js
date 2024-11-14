const db = require('../models/db');

// Método para obter saída de produto(s)
exports.getSaidaEstoque = (req, res) => {
    const id = req.query.id_produto;
  
    let query = 'SELECT * FROM produtos JOIN saida_produto ON saida_produto.id_produto = produtos.id_produto';
  
    if (id) {
      query += ' WHERE saida_produto.id_produto = ?';
    }
  
    db.query(query, [id], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  };

// // Método para criar uma nova saída de produto
// exports.createSaidaProduto = (req, res) => {
//   const { quantidade, valor_unitario, data_saida, id_produto, id_usuario } = req.body;
  
//   // Estrutura para inserir a saída de produto
//   const saidaProduto = { quantidade, valor_unitario, data_saida, id_produto, id_usuario };

//   db.query('INSERT INTO saida_produto SET ?', saidaProduto, (err, results) => {
//     if (err) return res.status(500).send(err);
//     res.status(201).json({ id_saida_produto: results.insertId, ...saidaProduto });
//   });
// };

// // Método para atualizar a saída de um produto
// exports.updateSaidaProduto = (req, res) => {
//   const id_saida_produto = req.params.id;
//   const { quantidade, valor_unitario, data_saida, id_produto, id_usuario } = req.body;

//   const saidaProduto = { quantidade, valor_unitario, data_saida, id_produto, id_usuario };

//   db.query(
//     'UPDATE saida_produto SET ? WHERE id_saida_produto = ?',
//     [saidaProduto, id_saida_produto],
//     (err) => {
//       if (err) return res.status(500).send(err);
//       res.sendStatus(204);
//     }
//   );
// };

// // Método para deletar uma saída de produto
// exports.deleteSaidaProduto = (req, res) => {
//   const id_saida_produto = req.params.id;
  
//   db.query('DELETE FROM saida_produto WHERE id_saida_produto = ?', [id_saida_produto], (err) => {
//     if (err) return res.status(500).send(err);
//     res.sendStatus(204);
//   });
// };
