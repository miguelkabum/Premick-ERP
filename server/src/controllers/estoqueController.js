const db = require('../models/db');

exports.getEstoque = (req, res) => {
  const id = req.query.id;

  let query = 'SELECT * FROM estoque';
  if (id) {
    query += ' WHERE id_produto = ?';
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.createEstoque = (req, res) => {
  const { qtde_atual, status, id_produto } = req.body;

  // Verifica se o produto existe
  db.query('SELECT * FROM produtos WHERE id_produto = ?', [id_produto], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) {
      return res.status(400).json({ message: "Produto não encontrado" });
    }

    const estoque = { qtde_atual, status, id_produto };

    db.query('INSERT INTO estoque SET ?', estoque, (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ id_estoque: results.insertId, ...estoque });
    });
  });
};

exports.updateEstoque = (req, res) => {
  const id_estoque = req.params.id;
  const { qtde_atual, status } = req.body;
  const estoque = { qtde_atual, status };

  db.query('UPDATE estoque SET ? WHERE id_estoque = ?', [estoque, id_estoque], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};

exports.deleteEstoque = (req, res) => {
  const id_estoque = req.params.id;

  db.query('DELETE FROM estoque WHERE id_estoque = ?', [id_estoque], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};
