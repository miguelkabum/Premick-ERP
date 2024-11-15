const express = require('express');
const router = express.Router();
const produtosCanceladosController = require('../controllers/produtosCanceladosController');

router.get('/', produtosCanceladosController.getProdutosCancelados);
// router.post('/', produtosCanceladosController.createProdutosCancelados);
router.put('/:id', produtosCanceladosController.updateProdutosCancelados);
router.delete('/:id', produtosCanceladosController.deleteProdutosCancelados);

module.exports = router;
