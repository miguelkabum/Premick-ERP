const express = require('express');
const router = express.Router();
const vendasController = require('../controllers/vendasController');

router.get('/', vendasController.getVendas);
router.post('/', vendasController.registrarVenda);
router.put('/:id', vendasController.updateVenda);
router.delete('/:id', vendasController.deleteVenda);

module.exports = router;
