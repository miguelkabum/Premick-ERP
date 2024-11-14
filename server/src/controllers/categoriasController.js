const db = require('../models/db');

exports.getCategorias = (req, res) => {
  const id = req.query.id;

  let query = 'SELECT * FROM categorias';
  if (id) {
    query += ' WHERE id_categoria = ?';
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.createCategoria = (req, res) => {
  const { nome_categoria } = req.body;
  const produto = { nome_categoria };
  db.query('INSERT INTO categorias SET ?', produto, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id_produto: results.insertId, ...produto });
  });
};

exports.updateCategoria = (req, res) => {
  const  id_categoria  = req.params.id;
  const produto = req.body;
  db.query('UPDATE categorias SET ? WHERE id_categoria = ?', [produto, id_categoria], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};

exports.deleteCategoria = (req, res) => {
  const  id_categoria  = req.params.id;
  db.query('DELETE FROM categorias WHERE id_categoria = ?', [id_categoria], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};
