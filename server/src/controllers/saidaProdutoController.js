const db = require('../models/db');

// Método para obter saída de produto(s)
exports.getSaidaProduto = (req, res) => {
  const id = req.query.id;

  // Modificar para trabalhar com a tabela 'saida_produto'
  let query = 'SELECT * FROM saida_produto';
  if (id) {
    query += ' WHERE id_saida_produto = ?';
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Método para criar uma nova saída de produto
exports.createSaidaProduto = (req, res) => {
  const { quantidade, valor_unitario, data_saida, obs_saida_produto, id_produto, id_usuario } = req.body;
  
  // Verificar se data_saida foi recebida ou, se não, usar a data atual (NOW())
  // const dataAtual = data_saida ? new Date(data_saida) : new Date(); // Se a data for passada, usa ela; caso contrário, usa a data atual

  // Estrutura para inserir a saída de produto
  const saidaProduto = { quantidade, valor_unitario, 
    // data_saida: dataAtual, 
    obs_saida_produto, id_produto, id_usuario: id_usuario || 1 };

  db.query('INSERT INTO saida_produto SET ?, data_saida = NOW()', saidaProduto, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id_saida_produto: results.insertId, ...saidaProduto });
  });
};

// Método para atualizar a saída de um produto
exports.updateSaidaProduto = (req, res) => {
  const id_saida_produto = req.params.id;
  const { quantidade, valor_unitario, data_saida, id_produto, id_usuario } = req.body;

  const saidaProduto = { quantidade, valor_unitario, data_saida, id_produto, id_usuario };

  db.query(
    'UPDATE saida_produto SET ? WHERE id_saida_produto = ?',
    [saidaProduto, id_saida_produto],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(204);
    }
  );
};

// Método para deletar uma saída de produto
exports.deleteSaidaProduto = (req, res) => {
  const id_saida_produto = req.params.id;
  
  db.query('DELETE FROM saida_produto WHERE id_saida_produto = ?', [id_saida_produto], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};
