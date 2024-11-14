const db = require('../models/db');  // Conexão com o banco de dados

// 1. Recuperar todos os cancelamentos ou um cancelamento específico por ID
exports.getCancelamentos = (req, res) => {
  const id = req.query.id;  // Pega o ID do cancelamento via query string

  let query = 'SELECT * FROM cancelamentos';
  if (id) {
    query += ' WHERE id_cancelamento = ?';  // Filtro por ID de cancelamento
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);  // Retorna erro se ocorrer algum problema
    res.json(results);  // Retorna os resultados encontrados
  });
};

// 2. Criar um novo cancelamento
exports.createCancelamento = (req, res) => {
  const { id_venda, id_produto, qtde_cancelada } = req.body;  // Obtém os dados do corpo da requisição

  // Cria um objeto com os dados para inserção
  const cancelamento = { id_venda, id_produto, qtde_cancelada };

  // Insere o novo cancelamento na tabela
  db.query('INSERT INTO cancelamentos SET ?', cancelamento, (err, results) => {
    if (err) return res.status(500).send(err);  // Retorna erro se houver falha
    res.status(201).json({ id_cancelamento: results.insertId, ...cancelamento });  // Retorna o novo cancelamento com ID gerado
  });
};

// 3. Atualizar um cancelamento existente
exports.updateCancelamento = (req, res) => {
  const id_cancelamento = req.params.id;  // Pega o ID do cancelamento a ser atualizado via parâmetros
  const { id_venda, id_produto, qtde_cancelada } = req.body;  // Obtém os dados para atualização

  // Cria um objeto com os dados atualizados
  const cancelamento = { id_venda, id_produto, qtde_cancelada };

  // Atualiza o cancelamento na tabela
  db.query('UPDATE cancelamentos SET ? WHERE id_cancelamento = ?', [cancelamento, id_cancelamento], (err) => {
    if (err) return res.status(500).send(err);  // Retorna erro se falhar
    res.sendStatus(204);  // Retorna sucesso sem conteúdo
  });
};

// 4. Excluir um cancelamento
exports.deleteCancelamento = (req, res) => {
  const id_cancelamento = req.params.id;  // Pega o ID do cancelamento a ser deletado

  // Exclui o cancelamento da tabela
  db.query('DELETE FROM cancelamentos WHERE id_cancelamento = ?', [id_cancelamento], (err) => {
    if (err) return res.status(500).send(err);  // Retorna erro se houver falha
    res.sendStatus(204);  // Retorna sucesso sem conteúdo
  });
};
