const express = require('express');

const shopController = require('../controllers/shop');

////////////////////////////////////////////////////////////

const router = express.Router();//EXPRESS做路由這件事

router.get('/', shopController.getIndex);
router.get('/cart', shopController.getCart);
router.post('/cart-add-item', shopController.postCartAddItem);
router.post('/cart-delete-item', shopController.postCartDeleteItem);

module.exports = router;//接收require導出的東西並模組化