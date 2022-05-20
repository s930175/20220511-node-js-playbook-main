const express = require('express');

const authController = require('../controllers/auth');

////////////////////////////////////////////////////////////

const router = express.Router();
//定義路由及方法('路徑', '控制', '方法名(連到controllers)')

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.post('/signup', authController.postSignup)

// router.post('/login', authController.postLogin);

module.exports = router;