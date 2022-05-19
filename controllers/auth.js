const getLogin = (req, res) => {
    res.status(200)
        .render('auth/login', {
            path: '/login',
            pageTitle: 'Login'
        });
};

const postLogin = (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        res.redirect('/');
    } else {
        console.log('欄位尚未填寫完成！')
    }
};

const postLogout = (req, res) => {
    // TODO: 實作 logout 機制
    res.redirect('/login')
}

module.exports = {
    //這些方法由routes定義
    getLogin,
    postLogin,
    postLogout,
};