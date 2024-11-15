const db = require('../models/db');

exports.login = (req, res) => {
  const { email, senha } = req.body;
  console.log("oi")
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  db.query('SELECT * FROM usuarios WHERE email_usuario = ?', [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const user = results[0];

    res.json({
      message: 'Login bem-sucedido',
      user: {
        id_usuario: user.id_usuario,
        nome_usuario: user.nome_usuario,
        email_usuario: user.email_usuario,
      },
    });
  });
};

exports.getUsuarios = (req, res) => {
  const id = req.query.id; // Pega o id da query string

  // Se um id for fornecido, filtra os resultados
  let query = 'SELECT * FROM usuarios';
  if (id) {
    query += ' WHERE id_usuario = ?'; // Alterado para o nome correto da coluna
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.createUsuario = (req, res) => {
  const { nome_usuario, email_usuario, senha_usuario } = req.body; // Desestruturar para nomes corretos
  const produto = { nome_usuario, email_usuario, senha_usuario }; // Montando objeto com nomes corretos
  db.query('INSERT INTO usuarios SET ?', produto, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id_usuario: results.insertId, ...produto }); // Mudança para id_usuario
  });
};

exports.updateUsuario = (req, res) => {
  const  id_usuario  = req.params.id; // Mudança para o nome correto
  const produto = req.body;
  db.query('UPDATE usuarios SET ? WHERE id_usuario = ?', [produto, id_usuario], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};

exports.deleteUsuario = (req, res) => {
  const  id_usuario  = req.params.id; // Mudança para o nome correto
  db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id_usuario], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};
