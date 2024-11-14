const db = require('../models/db');

exports.getClientes = (req, res) => {
  const id = req.query.id;

  let query = 'SELECT * FROM clientes';
  if (id) {
    query += ' WHERE id_cliente = ?';
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.createCliente = (req, res) => {
  const { nome_cliente, cep, numero, logradouro, uf, cidade, bairro, complemento, telefone_cliente, CPF_cliente, CNPJ_cliente } = req.body;
  const cliente = { nome_cliente, cep, numero, logradouro, uf, cidade, bairro, complemento, telefone_cliente, CPF_cliente, CNPJ_cliente };
  
  db.query('INSERT INTO clientes SET ?', cliente, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id_cliente: results.insertId, ...cliente });
  });
};

exports.updateCliente = (req, res) => {
  const  id_cliente  = req.params.id;
  const cliente = req.body;
  db.query('UPDATE clientes SET ? WHERE id_cliente = ?', [cliente, id_cliente], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};

exports.deleteCliente = (req, res) => {
  const  id_cliente  = req.params.id;
  db.query('DELETE FROM clientes WHERE id_cliente = ?', [id_cliente], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};
