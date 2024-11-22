const express = require('express');
const router = express.Router();
const mensagensController = require('../controllers/mensagensController');

router.get('/', mensagensController.getMensagens);
router.post('/', mensagensController.createMensagem);
router.put('/:id', mensagensController.updateMensagem);
router.delete('/:id', mensagensController.deleteMensagem);

module.exports = router;
