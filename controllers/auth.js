const User = require('../models/user');

const getLogin = (req, res) => {
    res.status(200)
        .render('auth/login', {
            path: '/login',
            pageTitle: 'Login'
        });
};

// const postLogin = (req, res) => {
//     const { email, password } = req.body;
//     if (email && password) {
//         res.redirect('/');
//     } else {
//         console.log('欄位尚未填寫完成！')
//     }
// };
const postLogin = (req, res) => {
    //解構賦值
    const { email, password } = req.body;
    User.findOne({ where: { email:email }})
        .then((user) => {
            if (!user) {
                console.log('login: 找不到此 user 或密碼錯誤');
                return res.redirect('/login');
            }
            if (user.password === password) {
                console.log('login: 成功');
                req.session.isLogin = true;
                return res.redirect('/')
            } 
            console.log('login: 密碼錯誤');
            res.redirect('/login');
        })
        .catch((err) => {
            console.log('login error:', err);
        });
};

const postLogout = (req, res) => {
    // req.session.isLogin = false;
    // // TODO: 實作 logout 機制
    // res.redirect('/login')

    //登出時毀滅session
    req.session.destroy((err) => {
        console.log('session destroy() error: ', err);
        res.redirect('/login');
    });
}

module.exports = {
    //這些方法由routes定義
    getLogin,
    postLogin,
    postLogout,
};