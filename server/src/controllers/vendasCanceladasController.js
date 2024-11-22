require('dotenv').config();
const mysql = require('mysql2/promise');

const getTableColumns = async (connection, tableName) => {
  // Consulta para pegar as colunas de uma tabela
  const [columns] = await connection.execute(`SHOW COLUMNS FROM ${tableName}`);
  return columns.map(column => column.Field);
};

const getValuesFromRequest = (fields, data) => {
  // Filtra os campos da requisição que são válidos para o banco
  return fields.reduce((acc, field) => {
    if (data[field] !== undefined) {
      acc[field] = data[field];
    }
    return acc;
  }, {});
};

exports.getVendasCanceladas = async (req, res) => {
  const id = req.query.id;

  let query = 'SELECT * FROM vendas_canceladas';
  if (id) {
    query += ' WHERE id_venda_cancelada = ?';
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      timezone: process.env.DB_TIMEZONE
    });

    const [results] = await connection.execute(query, [id]);
    res.json(results);
  } catch (err) {
    res.status(500).send(err);
  }
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

    // Obter as colunas da tabela vendas_canceladas
    const vendaCanceladaFields = await getTableColumns(connection, 'vendas_canceladas');

    // Filtra os dados da requisição para só incluir campos válidos
    const vendaCanceladaData = getValuesFromRequest(vendaCanceladaFields, req.body.venda_cancelada);

    // Insere a venda na tabela `vendas_canceladas`
    const [result] = await connection.execute(
      `INSERT INTO vendas_canceladas (${Object.keys(vendaCanceladaData).join(', ')}) VALUES (${Object.keys(vendaCanceladaData).map(() => '?').join(', ')})`,
      Object.values(vendaCanceladaData)
    );

    const idVendaCancelada = result.insertId;

    // Inserção dos produtos cancelados
    const produtosCanceladosFields = await getTableColumns(connection, 'produtos_cancelados');
    const produtosCanceladosQueries = req.body.produtos.map((produto) => {
      const produtoData = getValuesFromRequest(produtosCanceladosFields, produto);
      return connection.execute(
        `INSERT INTO produtos_cancelados (${Object.keys(produtoData).join(', ')}) VALUES (${Object.keys(produtoData).map(() => '?').join(', ')})`,
        Object.values(produtoData)
      );
    });

    await Promise.all(produtosCanceladosQueries);

    // Confirma a transação
    await connection.commit();
    console.log('Venda cancelada e produtos cancelados com sucesso!');
    
    res.status(200).json({ message: 'Venda Cancelada com sucesso!', id_venda_cancelada: idVendaCancelada });
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao registrar venda cancelada:', error);
    res.status(500).json({ message: 'Erro ao registrar venda cancelada', error: error.message });
  } finally {
    await connection.end();
  }
};

exports.updateVendaCancelada = async (req, res) => {
  const id_venda_cancelada = req.params.id;
  const venda_cancelada = req.body;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: process.env.DB_TIMEZONE
  });

  try {
    const vendaCanceladaFields = await getTableColumns(connection, 'vendas_canceladas');
    const vendaCanceladaData = getValuesFromRequest(vendaCanceladaFields, venda_cancelada);

    const updateQuery = `UPDATE vendas_canceladas SET ${Object.keys(vendaCanceladaData)
      .map((key) => `${key} = ?`)
      .join(', ')} WHERE id_venda_cancelada = ?`;

    await connection.execute(updateQuery, [...Object.values(vendaCanceladaData), id_venda_cancelada]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    await connection.end();
  }
};

exports.deleteVendaCancelada = async (req, res) => {
  const id_venda_cancelada = req.params.id;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: process.env.DB_TIMEZONE
  });

  try {
    await connection.execute('DELETE FROM vendas_canceladas WHERE id_venda_cancelada = ?', [id_venda_cancelada]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    await connection.end();
  }
};
