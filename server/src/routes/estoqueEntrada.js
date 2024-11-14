const express = require('express');
const router = express.Router();
const estoqueEntradaController = require('../controllers/estoqueEntradaController');

router.get('/', estoqueEntradaController.getEntradaEstoque);
// router.post('/', estoqueEntradaController.createProduto);
// router.put('/:id', estoqueEntradaController.updateProduto);
// router.delete('/:id', estoqueEntradaController.deleteProduto);

module.exports = router;
