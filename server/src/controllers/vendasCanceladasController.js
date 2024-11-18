require('dotenv').config();
const db = require('../models/db');
const mysql = require('mysql2/promise')

exports.getVendasCanceladas = (req, res) => {
  const id = req.query.id;

  let query = 'SELECT * FROM vendas_canceladas';
  if (id) {
    query += ' WHERE id_venda_cancelada = ?';
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};


exports.registrarVendaCancelada = async (req, res) => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: process.env.DB_TIMEZONE
  });

  try {
    console.log("Vendas Canceladas:", req.body);
    // Inicia a transação
    await connection.beginTransaction();

    // Insere a venda na tabela `vendas_canceladas`
    const [result] = await connection.execute(
      `INSERT INTO vendas_canceladas (data_venda_cancelada, valor_total, metodo_pagamento, desconto, obs_vendas_canceladas, id_cliente, id_usuario) VALUES (NOW(), ?, ?, ?, ?, ?, ?)`,
      [req.body.venda_cancelada.valor_total, req.body.venda_cancelada.metodo_pagamento, req.body.venda_cancelada.desconto, req.body.venda_cancelada.obs_vendas_canceladas, req.body.venda_cancelada.id_cliente, req.body.venda_cancelada.id_usuario]
    );

    // Pega o ID da venda cancelada recém-criada
    const idVendaCancelada = result.insertId;

    // Prepara as queries para inserir os produtos cancelados
    const produtosCanceladosQueries = req.body.produtos.map((produto) => {
        return connection.execute(
            `INSERT INTO produtos_cancelados (id_venda_cancelada, id_produto, qtde_cancelada, preco_unitario) VALUES (?, ?, ?, ?)`,
            [idVendaCancelada, produto.id_produto, produto.quantidade, produto.preco_venda]
        );
    });

    // Executa todas as queries dos produtos cancelados
    await Promise.all(produtosCanceladosQueries);

    // Confirma a transação
    await connection.commit();
    console.log('Venda cancelada e produtos cancelados com sucesso!');
    
    // Resposta de sucesso com o ID da venda cancelada criada
    res.status(200).json({ message: 'Venda Cancelada com sucesso!', id_venda_cancelada: idVendaCancelada });
  } catch (error) {
    // Reverte a transação em caso de erro
    await connection.rollback();
    console.error('Erro ao registrar venda cancelada:', error);
    res.status(500).json({ message: 'Erro ao registrar venda cancelada', error: error.message });
  } finally {
    // Fecha a conexão
    await connection.end();
  }
};


exports.updateVendaCancelada = (req, res) => {
  const id_venda_cancelada = req.params.id;
  const venda_cancelada = req.body;
  
  // Atualização na tabela vendas
  db.query('UPDATE vendas_canceladas SET ? WHERE id_venda_cancelada = ?', [venda_cancelada, id_venda_cancelada], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);  // OK sem conteúdo
  });
};


exports.deleteVendaCancelada = (req, res) => {
  const id_venda_cancelada = req.params.id;

  // Exclusão na tabela vendas
  db.query('DELETE FROM vendas_canceladas WHERE id_venda_cancelada = ?', [id_venda_cancelada], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);  // OK sem conteúdo
  });
};
