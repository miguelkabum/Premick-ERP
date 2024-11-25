const db = require('../models/db');

// 1. Obter alertas de estoque
exports.getAlertasEstoque = (req, res) => {
  const id_alerta = req.query.id_alerta;

  let query = 'SELECT ae.id_alerta, ae.id_produto, p.nome_produto, ae.mensagem, ae.data_alerta, ae.visualizado FROM alertas_estoque ae JOIN produtos p ON ae.id_produto = p.id_produto ORDER BY ae.data_alerta DESC';
  if (id_alerta) {
    query += ' WHERE id_alerta = ?';
  }

  db.query(query, [id_alerta], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// 2. Criar novo alerta de estoque
exports.createAlertaEstoque = (req, res) => {
  const { id_produto, mensagem, data_alerta } = req.body;

  // Verificar se todos os campos estão presentes
  if (!id_produto || !mensagem || !data_alerta) {
    return res.status(400).json({ error: 'Faltando dados obrigatórios' });
  }

  const alertaEstoque = { id_produto, mensagem, data_alerta };

  db.query('INSERT INTO alertas_estoque SET ?', alertaEstoque, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id_alerta: results.insertId, ...alertaEstoque });
  });
};

// 3. Atualizar alerta de estoque
exports.updateAlertaEstoque = (req, res) => {
  const id_alerta = req.params.id;

  db.query('UPDATE alertas_estoque SET visualizado = 1 WHERE id_alerta = ?', [id_alerta], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204); // No content
  });
};

// 4. Deletar alerta de estoque
exports.deleteAlertaEstoque = (req, res) => {
  const id_alerta = req.params.id_alerta;

  db.query('DELETE FROM alertas_estoque WHERE id_alerta = ?', [id_alerta], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204); // No content
  });
};
