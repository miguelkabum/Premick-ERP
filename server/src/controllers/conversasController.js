const db = require('../models/db');

exports.getConversas = (req, res) => {
  const id = req.query.id;

  let query = 'SELECT * FROM conversas';
  if (id) {
    query += ' WHERE id_conversa = ?';
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.createConversa = (req, res) => {
  const { nome_produto, codigo_barras, codigo_interno, unidade_medida, preco_venda, estoque_minimo, estoque_maximo, id_categoria } = req.body;
  const produto = { nome_produto, codigo_barras, codigo_interno, unidade_medida, preco_venda, estoque_minimo, estoque_maximo, id_categoria };
  db.query('INSERT INTO produtos SET ?', produto, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id_produto: results.insertId, ...produto });
  });
};

exports.updateConversa = (req, res) => {
  const  id_produto  = req.params.id;
  const produto = req.body;
  db.query('UPDATE produtos SET ? WHERE id_produto = ?', [produto, id_produto], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};

exports.deleteConversa = (req, res) => {
  const  id_conversa  = req.params.id;
  db.query('DELETE FROM conversas WHERE id_conversa = ?', [id_conversa], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};
