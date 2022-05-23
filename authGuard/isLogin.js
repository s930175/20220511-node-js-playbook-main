//避免有人亂打網址
module.exports = (req, res, next) => {
    if (!req.session.isLogin) {
        return res.redirect('/login');
    }
    next();
}