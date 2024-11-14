const db = require('../models/db');

// Função para obter uma entrada de produto específica ou todas as entradas
exports.getEntradaProduto = (req, res) => {
  const id = req.query.id;

  let query = 'SELECT * FROM entrada_produto';
  let params = [];

  if (id) {
    query += ' WHERE id_entrada_produto = ?';
    params.push(id);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Função para criar uma nova entrada de produto
exports.createEntradaProduto = (req, res) => {
  const { quantidade, quantidade_disponivel, valor_unitario, data_entrada, obs_entrada_produto, id_produto, id_usuario } = req.body;

  // // Certifique-se de que os dados recebidos estão corretos
  // if (!quantidade || !quantidade_disponivel || !valor_unitario || !data_entrada || !id_produto) {
  //   return res.status(400).send('Campos obrigatórios ausentes');
  // }

  // Verificar se data_entrada foi recebida ou, se não, usar a data atual (NOW())
  // const dataAtual = data_entrada ? new Date(data_entrada) : new Date(); // Se a data for passada, usa ela; caso contrário, usa a data atual

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
    res.status(201).json({ id_entrada_produto: results.insertId, ...entradaProduto });
  });
};

// Função para atualizar uma entrada de produto
exports.updateEntradaProduto = (req, res) => {
  const id_entrada_produto = req.params.id;
  const { quantidade, quantidade_disponivel, valor_unitario, data_entrada } = req.body;

  // Verificar se os campos obrigatórios estão presentes
  if (!quantidade || !quantidade_disponivel || !valor_unitario || !data_entrada) {
    return res.status(400).send('Campos obrigatórios ausentes');
  }

  const entradaProduto = {
    quantidade,
    quantidade_disponivel,
    valor_unitario,
    data_entrada
  };

  db.query('UPDATE entrada_produto SET ? WHERE id_entrada_produto = ?', [entradaProduto, id_entrada_produto], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};

// Função para excluir uma entrada de produto
exports.deleteEntradaProduto = (req, res) => {
  const id_entrada_produto = req.params.id;

  db.query('DELETE FROM entrada_produto WHERE id_entrada_produto = ?', [id_entrada_produto], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};
