require('dotenv').config();
const db = require('../models/db');
const mysql = require('mysql2/promise')

exports.getVendas = (req, res) => {
  const id = req.query.id;

  let query = 'SELECT * FROM vendas';
  if (id) {
    query += ' WHERE id_venda = ?';
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.registrarVenda = async (req, res) => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: process.env.DB_TIMEZONE
  });

  try {
    console.log("Vendas:", req.body);
    // Inicia a transação
    await connection.beginTransaction();

    // Insere a venda na tabela `vendas`
    const [result] = await connection.execute(
      `INSERT INTO vendas (data_compra, nf_venda, valor_total, metodo_pagamento, desconto, obs_vendas, id_cliente, id_usuario) VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?)`,
      [req.body.venda.nf_venda, req.body.venda.valor_total, req.body.venda.metodo_pagamento, req.body.venda.desconto, req.body.venda.obs_vendas, req.body.venda.id_cliente, req.body.venda.id_usuario]
    );

    // Pega o ID da venda recém-criada
    const idVenda = result.insertId;

    // Prepara as queries para inserir os produtos vendidos
    const produtosVendidosQueries = req.body.produtos.map((produto) => {
      if (produto.status == 'OK') {
        return connection.execute(
          `INSERT INTO produtos_vendidos (id_venda, id_produto, qtde_produto, preco_unitario) VALUES (?, ?, ?, ?)`,
          [idVenda, produto.id_produto, produto.quantidade, produto.preco_venda]
        );
      }
    });

    // Prepara as queries para inserir os produtos cancelados
    const produtosCanceladosQueries = req.body.produtos.map((produto) => {
      if (produto.status == 'CANCELADO') {
        return connection.execute(
          `INSERT INTO produtos_cancelados (id_venda, id_produto, qtde_cancelada, preco_unitario) VALUES (?, ?, ?, ?)`,
          [idVenda, produto.id_produto, produto.quantidade, produto.preco_venda]
        );
      }
    });

    // Executa todas as queries dos produtos vendidos
    await Promise.all(produtosVendidosQueries, produtosCanceladosQueries);

    // Confirma a transação
    await connection.commit();
    console.log('Venda e produtos registrados com sucesso!');
    
    // Resposta de sucesso com o ID da venda criada
    res.status(200).json({ message: 'Venda registrada com sucesso!', id_venda: idVenda });
  } catch (error) {
    // Reverte a transação em caso de erro
    await connection.rollback();
    console.error('Erro ao registrar venda:', error);
    res.status(500).json({ message: 'Erro ao registrar venda', error: error.message });
  } finally {
    // Fecha a conexão
    await connection.end();
  }
};


exports.createVenda = (req, res) => {
  const { data_compra, nf_venda, valor_total, metodo_pagamento, desconto, id_cliente, id_usuario } = req.body;
  const venda = { data_compra, nf_venda, valor_total, metodo_pagamento, desconto, id_cliente, id_usuario };
  
  // Inserção na tabela vendas
  db.query('INSERT INTO vendas SET ?', venda, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id_venda: results.insertId, ...venda });
  });
};

exports.updateVenda = (req, res) => {
  const id_venda = req.params.id;
  const venda = req.body;
  
  // Atualização na tabela vendas
  db.query('UPDATE vendas SET ? WHERE id_venda = ?', [venda, id_venda], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);  // OK sem conteúdo
  });
};

exports.deleteVenda = (req, res) => {
  const id_venda = req.params.id;

  // Exclusão na tabela vendas
  db.query('DELETE FROM vendas WHERE id_venda = ?', [id_venda], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);  // OK sem conteúdo
  });
};
