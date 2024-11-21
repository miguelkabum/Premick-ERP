const express = require('express');
const router = express.Router();
const mickAPIController = require('../controllers/mickAPIController');

// router.get('/', mickAPIController.getProduto);
router.post('/', mickAPIController.consultarAPI);
// router.put('/:id', mickAPIController.updateProduto);
// router.delete('/:id', mickAPIController.deleteProduto);

module.exports = router;
