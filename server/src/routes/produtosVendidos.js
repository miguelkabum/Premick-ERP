const express = require('express');
const router = express.Router();
const produtosVendidosController = require('../controllers/produtosVendidosController');

router.get('/', produtosVendidosController.getProdutosVendidos);
router.post('/', produtosVendidosController.createProdutoVendido);
router.put('/:id', produtosVendidosController.updateProdutoVendido);
router.delete('/:id', produtosVendidosController.deleteProdutoVendido);

module.exports = router;
