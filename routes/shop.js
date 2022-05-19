const express = require('express');

const shopController = require('../controllers/shop');

////////////////////////////////////////////////////////////

const router = express.Router();//EXPRESS做路由這件事

router.get('/', shopController.getIndex);

module.exports = router;//接收require導出的東西並模組化