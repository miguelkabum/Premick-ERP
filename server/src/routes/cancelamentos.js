const express = require('express');
const router = express.Router();
const cancelamentosController = require('../controllers/cancelamentosController');

router.get('/', cancelamentosController.getCancelamentos);
router.post('/', cancelamentosController.createCancelamento);
router.put('/:id', cancelamentosController.updateCancelamento);
router.delete('/:id', cancelamentosController.deleteCancelamento);

module.exports = router;
