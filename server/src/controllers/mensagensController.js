const db = require('../models/db');

exports.getMensagens = (req, res) => {
  const id = req.query.id;

  let query = 'SELECT * FROM mensagens';
  if (id) {
    query += ' WHERE id_conversa = ?';
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.createMensagem = (req, res) => {
  const { id_conversa, tipo_mensagem, conteudo } = req.body;
  // id_mensagem, id_conversa, tipo_mensagem, conteudo, data_envio

  const mensagem = { id_conversa: id_conversa || 1, tipo_mensagem, conteudo };

  db.query('INSERT INTO mensagens SET ?, data_envio = NOW()', mensagem, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id_mensagem: results.insertId, ...mensagem });
  });
};

exports.updateMensagem = (req, res) => { // FALTA OLHAR OS UPDATES
  const  id_mensagem  = req.params.id;
  const mensagem = req.body;
  db.query('UPDATE mensagens SET ? WHERE id_mensagem = ?', [mensagem, id_mensagem], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};

exports.deleteMensagem = (req, res) => {
  const  id_mensagem  = req.params.id;
  db.query('DELETE FROM mensagens WHERE id_mensagem = ?', [id_mensagem], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};
