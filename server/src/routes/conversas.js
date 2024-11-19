const express = require('express');
const router = express.Router();
const conversasController = require('../controllers/conversasController');

router.get('/', conversasController.getConversas);
router.post('/', conversasController.createConversa);
router.put('/:id', conversasController.updateConversa);
router.delete('/:id', conversasController.deleteConversa);

module.exports = router;
