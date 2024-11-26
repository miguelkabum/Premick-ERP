const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/totalvendido', dashboardController.getTotalVendido);
router.get('/totalinvestido', dashboardController.getTotalInvestido);
router.get('/vendadia', dashboardController.getDayCurrentSales);
router.get('/qtdevendadia', dashboardController.getDayCountSales);


module.exports = router;
