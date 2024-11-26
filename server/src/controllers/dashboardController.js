const db = require('../models/db');

exports.getTotalVendido = (req, res) => {
  const { data_inicial, data_final } = req.body;

  let query = "SELECT SUM(valor_total) AS valor_total_vendido FROM vendas";
//   if (id) {
//     query += " WHERE data_compra BETWEEN '2024-02-02' AND '2024-02-09'";
//   }

  db.query(query, /*[data_inicial, data_final],*/ (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.getTotalInvestido = (req, res) => {
    const { data_inicial, data_final } = req.body;

    let query = "SELECT SUM(valor_unitario * quantidade) AS valor_total_investido FROM entrada_produto";
    // if (id) {
    //   query += " WHERE data_entrada BETWEEN '2024-01-02' AND '2024-01-14'";
    // }
  
    db.query(query, /*[data_inicial, data_final],*/ (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
};

exports.getDayCurrentSales = (req, res) => {

    let query = "SELECT SUM(valor_total) AS valor_total_vendido FROM vendas WHERE DATE(data_compra) = curdate();";
  
    db.query(query, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
};

exports.getCountSales = (req, res) => {
    const { data_inicial, data_final } = req.body;
  
    let query = "SELECT count(*) AS qtde_total_vendas FROM vendas";
  //   if (id) {
  //     query += " WHERE data_compra BETWEEN '2024-02-02' AND '2024-02-09'";
  //   }
  
    db.query(query, /*[data_inicial, data_final],*/ (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  };

exports.getDayCountSales = (req, res) => {
    const { data_inicial, data_final } = req.body;
  
    let query = "SELECT count(*) AS qtde_total_vendas FROM vendas WHERE DATE(data_compra) = curdate()";
  //   if (id) {
  //     query += " WHERE data_compra BETWEEN '2024-02-02' AND '2024-02-09'";
  //   }
  
    db.query(query, /*[data_inicial, data_final],*/ (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  };
