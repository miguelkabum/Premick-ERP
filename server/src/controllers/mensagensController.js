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
  const { id_conversa, tipo_mensagem, conteudo, data_envio } = req.body;
// id_mensagem, id_conversa, tipo_mensagem, conteudo, data_envio
  const mensagem = { nome_produto, codigo_barras, codigo_interno, unidade_medida, preco_venda, estoque_minimo, estoque_maximo, id_categoria };

  const entradaProduto = { 
    quantidade, 
    quantidade_disponivel: quantidade, 
    valor_unitario, 
    // data_entrada: dataAtual, 
    obs_entrada_produto, 
    id_produto, 
    id_usuario: id_usuario || 1  // Caso id_usuario não seja enviado, atribuímos o valor 1 por padrão
  };

  db.query('INSERT INTO entrada_produto SET ?, data_entrada = NOW()', entradaProduto, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id_mensagem: results.insertId, ...mensagem });
  });
};

exports.updateMensagem = (req, res) => {
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
