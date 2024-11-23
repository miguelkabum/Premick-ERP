require('dotenv').config();
const db = require('../models/db');
const mysql = require('mysql2/promise')


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


exports.createMensagem = async (req, res) => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: process.env.DB_TIMEZONE
  });

  const { tipo_mensagem, conteudo, id_usuario } = req.body;

  let id_conversa = req.body.id_conversa;

  if (id_conversa == 0) {
    try {
      // Inicia a transação
      await connection.beginTransaction();

      const titulo = conteudo.length > 20 ? conteudo.slice(0, 20) : conteudo; // Gera o título da conversa com base no conteúdo

      // Insere a conversa na tabela `conversas`
      const [result] = await connection.execute(
        `INSERT INTO conversas (id_usuario, titulo, data_inicio, ultimo_acesso) VALUES (?, ?, NOW(), NOW())`,
        [id_usuario, titulo]
      );

      // Pega o ID da conversa recém-criada
      id_conversa = result.insertId;

      // Insere a mensagem na tabela `mensagens`
      const [message] = await connection.execute(
        `INSERT INTO mensagens (id_conversa, tipo_mensagem, conteudo, data_envio) VALUES (?, ?, ?, NOW())`,
        [id_conversa, tipo_mensagem, conteudo]
      );

      // const id_mensagem = message.insertId;

      try {
        const response = await fetch('http://localhost:5000/api/mick', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conteudo, id_conversa }),
        });

        const data = await response.json();
        console.log("resposta mickController status:", response.ok)
        console.log("Resposta mickController:", data.resposta)

        if (response.ok) {
          console.log("Resposta:", data.resposta)
        } else {
          console.log('Erro ao receber a resposta.');
        }
      } catch (error) {
        console.log('Erro na comunicação com o servidor.\nErro: ', error);
      }

      // Confirma a transação
      await connection.commit();

      // Resposta de sucesso com o ID da conversa e mensagem criadas
      res.status(200).json({
        message: 'Conversa e mensagem registradas com sucesso!',
        id_conversa
      });

    } catch (error) {
      // Reverte a transação em caso de erro
      await connection.rollback();
      console.error('Erro ao registrar conversa:', error);
      res.status(500).json({ message: 'Erro ao registrar conversa', error: error.message });
    } finally {
      // Fecha a conexão
      await connection.end();
    }
  } else {

    // Insere a mensagem vinculada a uma conversa existente
    db.query(
      'INSERT INTO mensagens (id_conversa, tipo_mensagem, conteudo, data_envio) VALUES (?, ?, ?, NOW())',
      [id_conversa, tipo_mensagem, conteudo],
      (err, results) => {
        if (err) return res.status(500).send(err);
        // res.status(200).json({ id_mensagem: results.insertId });
      }
    );

    try {
      const response = await fetch('http://localhost:5000/api/mick', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conteudo, id_conversa }),
      });

      const data = await response.json();
      console.log("resposta mickController status:", response.ok)
      console.log("Resposta mickController:", data.resposta)

      if (response.ok) {
        console.log("Resposta:", data.resposta)
      } else {
        console.log('Erro ao receber a resposta.');
      }
    } catch (error) {
      console.log('Erro na comunicação com o servidor.\nErro: ', error);
    }

    res.status(200).json({ id_conversa });
  }
};


exports.updateMensagem = (req, res) => { // FALTA OLHAR OS UPDATES
  const id_mensagem = req.params.id;
  const mensagem = req.body;
  db.query('UPDATE mensagens SET ? WHERE id_mensagem = ?', [mensagem, id_mensagem], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};

exports.deleteMensagem = (req, res) => {
  const id_mensagem = req.params.id;
  db.query('DELETE FROM mensagens WHERE id_mensagem = ?', [id_mensagem], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};
