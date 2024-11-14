const express = require('express');
const router = express.Router();
const produtosEstoqueController = require('../controllers/produtosEstoqueController');

router.get('/', produtosEstoqueController.getProdutosEstoque);
// router.post('/', produtosEstoqueController.createProduto);
// router.put('/:id', produtosEstoqueController.updateProduto);
// router.delete('/:id', produtosEstoqueController.deleteProduto);

module.exports = router;
