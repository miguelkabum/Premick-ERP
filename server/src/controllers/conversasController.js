const db = require('../models/db');

exports.getConversas = (req, res) => {
  const id = req.query.id;

  let query = 'SELECT * FROM conversas'; // É seguro deixar a opção de ver todos os chats?
  if (id) {
    query += ' WHERE id_usuario = ?'; // Histórico de Chats por Usuário
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.createConversa = (req, res) => {
  const { id_usuario, titulo } = req.body;
  // id_conversa, id_usuario, titulo, data_inicio, ultimo_acesso
  const conversa = { id_usuario: id_usuario || 3, titulo };

  db.query('INSERT INTO conversas SET ?, data_inicio = NOW(), ultimo_acesso = NOW()', conversa, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id_conversa: results.insertId, ...conversa });
  });
};

exports.updateConversa = (req, res) => { // FALTA OLHAR OS UPDATES
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
