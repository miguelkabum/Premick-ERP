const express = require('express');
const router = express.Router();
const estoqueSaidaController = require('../controllers/estoqueSaidaController');

router.get('/', estoqueSaidaController.getSaidaEstoque);
// router.post('/', estoqueSaidaController.createProduto);
// router.put('/:id', estoqueSaidaController.updateProduto);
// router.delete('/:id', estoqueSaidaController.deleteProduto);

module.exports = router;
