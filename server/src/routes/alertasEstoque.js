const express = require('express');
const router = express.Router();
const alertasEstoqueController = require('../controllers/alertasEstoqueController');

router.get('/', alertasEstoqueController.getAlertasEstoque);
router.post('/', alertasEstoqueController.createAlertaEstoque);
router.put('/:id', alertasEstoqueController.updateAlertaEstoque);
router.delete('/:id', alertasEstoqueController.deleteAlertaEstoque);

module.exports = router;
