const express = require('express');
const router = express.Router();
const saidaProdutoController = require('../controllers/saidaProdutoController');

router.get('/', saidaProdutoController.getSaidaProduto);
router.post('/', saidaProdutoController.createSaidaProduto);
router.put('/:id', saidaProdutoController.updateSaidaProduto);
router.delete('/:id', saidaProdutoController.deleteSaidaProduto);

module.exports = router;
