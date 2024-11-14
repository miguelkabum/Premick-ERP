const express = require('express');
const router = express.Router();
const entradaProdutoController = require('../controllers/entradaProdutoController');

router.get('/', entradaProdutoController.getEntradaProduto);
router.post('/', entradaProdutoController.createEntradaProduto);
router.put('/:id', entradaProdutoController.updateEntradaProduto);
router.delete('/:id', entradaProdutoController.deleteEntradaProduto);

module.exports = router;
