// const db = require('../models/db');

// exports.getUsuarios = (req, res) => {
//   const id = req.query.id; // Pega o id da query string

//   // Se um id for fornecido, filtra os resultados
//   let query = 'SELECT * FROM usuarios';
//   if (id) {
//     query += ' WHERE id_usuario = ?'; // Alterado para o nome correto da coluna
//   }

//   db.query(query, [id], (err, results) => {
//     if (err) return res.status(500).send(err);
//     res.json(results);
//   });
// };

// exports.createUsuario = (req, res) => {
//   const { nome_usuario, email_usuario, senha_usuario } = req.body; // Desestruturar para nomes corretos
//   const produto = { nome_usuario, email_usuario, senha_usuario }; // Montando objeto com nomes corretos
//   db.query('INSERT INTO usuarios SET ?', produto, (err, results) => {
//     if (err) return res.status(500).send(err);
//     res.status(201).json({ id_usuario: results.insertId, ...produto }); // Mudança para id_usuario
//   });
// };

// exports.updateUsuario = (req, res) => {
//   const  id_usuario  = req.params.id; // Mudança para o nome correto
//   const produto = req.body;
//   db.query('UPDATE usuarios SET ? WHERE id_usuario = ?', [produto, id_usuario], (err) => {
//     if (err) return res.status(500).send(err);
//     res.sendStatus(204);
//   });
// };

// exports.deleteUsuario = (req, res) => {
//   const  id_usuario  = req.params.id; // Mudança para o nome correto
//   db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id_usuario], (err) => {
//     if (err) return res.status(500).send(err);
//     res.sendStatus(204);
//   });
// };
