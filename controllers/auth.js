const User = require('../models/user');
const bcryptjs = require('bcryptjs');//密碼加密

const getLogin = (req, res) => {
    const errorMessage = req.flash('errorMessage')[0];
    res.status(200)
        .render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage:errorMessage
        });
};
const getSignup = (req, res) => {
    const errorMessage = req.flash('errorMessage')[0];
    res.status(200)
        .render('auth/signup', {
            pageTitle: 'Signup',
            errorMessage
        });
}

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
                req.flash('errorMessage', '錯誤的 Email 或 Password。');
                return res.redirect('/login');
            }
            // if (user.password === password) {
            //     console.log('login: 成功');d
            //     //登入狀態儲存在session
            //     req.session.isLogin = true;
            //     return res.redirect('/')
            // } 
            // req.flash('errorMessage', '錯誤的 Email 或 Password。');
            // res.redirect('/login');
            bcryptjs
            //比對輸入密碼(加密後)以及資料庫的密碼(加密後)
                .compare(password, user.password)
                .then((isMatch) => {
                    if (isMatch) {
                        req.session.user = user;
                        req.session.isLogin = true;
                        return req.session.save((err) => {
                            console.log('postLogin - save session error: ', err);
                            res.redirect('/');
                        });
                    }
                    res.redirect('/signup');
                })
                .catch((err) => {
                    req.flash('loginErrorMessage', '錯誤的 Email 或 Password。')
                    return res.redirect('/login');
                })
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

const postSignup = (req, res) => {
    const { displayName, email, password } = req.body;
    User.findOne({ where: { email } })
        .then((user) => {
            if (user) {
                req.flash('errorMessage', '此帳號已存在！請使用其他 Email。')
                return res.redirect('/signup');
            } else {
                //將輸入的資料作為參數傳入
                return bcryptjs.hash(password, 12)
                .then((hashedPassword) => {
                    //第一個參數是想要加密的數值，第二個參數是加密的強度
                    return User.create({ displayName, email, password: hashedPassword });
                })
                .catch((err) => {
                    console.log('create new user error: ', err);
                })
            }
        })
        .then((result) => {
            res.redirect('/login');
        })
        .catch((err) => {
            console.log('signup_error', err);
        });
}

module.exports = {
    //這些方法由routes定義
    getLogin,
    getSignup,
    postLogin,
    postLogout,
    postSignup
};