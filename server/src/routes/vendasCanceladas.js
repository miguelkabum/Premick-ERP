const express = require('express');
const router = express.Router();
const vendasCanceladasController = require('../controllers/vendasCanceladasController');

router.get('/', vendasCanceladasController.getVendasCanceladas);
router.post('/', vendasCanceladasController.registrarVendaCancelada);
router.put('/:id', vendasCanceladasController.updateVendaCancelada);
router.delete('/:id', vendasCanceladasController.deleteVendaCancelada);

module.exports = router;
