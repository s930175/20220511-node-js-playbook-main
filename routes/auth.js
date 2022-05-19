const express = require('express');

const authController = require('../controllers/auth');

////////////////////////////////////////////////////////////

const router = express.Router();
//定義路由及方法('路徑', '控制', '方法名(連到controllers)')

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

// router.post('/login', authController.postLogin);

module.exports = router;