// 第一個區塊 內建模組
const path = require('path');

// 第二個區塊 第三方模組(套件)
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectFlash = require('connect-flash');
const csrfProtection = require('csurf');

// 第三個區塊 自建模組
const database = require('./utils/database');
//連到路由(下面app.use使用路由)
const authRoutes = require('./routes/auth'); 
const shopRoutes = require('./routes/shop'); 
const errorRoutes = require('./routes/404');
const Product = require('./models/product');
//const req = require('express/lib/request');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

////////////////////////////////////////////////////////////////

const app = express();
const port = 3000;

// middleware
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
	secret: 'sessionToken',  // 加密用的字串
	resave: false,   // 沒變更內容是否強制回存
	saveUninitialized: false ,  // 新 session 未變更內容是否儲存
	cookie: {
		maxAge: 1000000  // session 狀態儲存多久？單位為毫秒
	}
})); 
app.use(connectFlash());
//bodyParser解析資料
app.use(bodyParser.urlencoded({ extended: false }));
app.use(csrfProtection());
//自定義的中介軟體進行儲存，每次執行的時候會經過這裡(app.js)都可執行到
// NOTE: 取得 User model (如果已登入的話)
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    //findByPk:primaryKey
    User.findByPk(req.session.user.id)
        .then((user) => {
            //require session存的user(後面的user是session的user)
            //require後再去controller shop裡
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log('find user by session id error: ', err);
        })
});

app.use((req, res, next) => {
    res.locals.pageTitle = 'Book Your Books online';
    res.locals.path = req.url;
    res.locals.isLogin = req.session.isLogin || false;
    res.locals.csrfToken = req.csrfToken();
    next();
});

// app.use((req, res, next) => {
// 	console.log('World!');
//     next();
// });

User.hasOne(Cart);
Cart.belongsTo(User);//cart對user是一對一
Cart.belongsToMany(Product, { through: CartItem });//cart和product是多對多
Product.belongsToMany(Cart, { through: CartItem });//CartItem用來記錄cart和product的關係

//使用路由
app.use(authRoutes);
app.use(shopRoutes);
app.use(errorRoutes);


database
    .sync({ force: true})
//force: true讓每次重啟資料庫時不會重新輸入products(強制重設db)
//但每次重開node app.js都是重塞新資料
    // .sync({ force: true })
	.then((result) => {
        //User.create({ displayName: 'Admin', email: 'admin@skoob.com', password: '11111111'});
        Product.bulkCreate(products);
		app.listen(port, () => {
			console.log(`Web Server is running on port ${port}`);
		});
	})
	.catch((err) => {
		console.log('create web server error: ', err);
	});
//這裡的資料送到mysql
const products = [
    {
        title: '四月是你的謊言 1',
        price: 80,
        description: '有馬公生的母親一心想把有馬培育成舉世聞名的鋼琴家，而有馬也不負母親的期望，在唸小學時就贏得許多鋼琴比賽的大獎。11歲的秋天，有馬的母親過世，從此他再也聽不見自己彈奏的鋼琴聲，沮喪的他也只好放棄演奏，但在14歲那年，經由兒時玩伴的介紹，有馬認識了小提琴手宮園薰，並被薰的自由奔放吸引，沒想到薰竟開口邀請公生在比賽時擔任她的伴奏…',
        imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/25/0010622563.jpg&v=52dcfd21&w=348&h=348'
    },
    {
        title: '四月是你的謊言 2',
        price: 80,
        description: '公主答應在二次預賽中擔任小薰的鋼琴伴奏。比賽一開始公生還能順利彈琴，但在中途又再次因為聽不見鋼琴的聲音而停手。沒想到小薰也跟著停止演奏、等候公生。原本心灰意冷的公生因此重新振作，與小薰合奏出驚人的樂章…......',
        imageUrl: 'https://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/31/0010623172.jpg&v=52dcfd21&w=348&h=348'
    },
    {
        title: '四月是你的謊言 3',
        price: 80,
        description: '在小薰的逼迫之下，公生不得不參加音樂比賽。為了參加比賽，公生從早到晚不停的練習，但就是無法彈奏出屬於自己的巴哈與蕭邦。此時，公生的面前出現兩位強勁的對手-相座武士與井川繪見，他們曾經是公生的手下敗將，一心想在比賽中擊敗公生雪恥。先上台演奏的武士彈奏出令全場喝采的激昂樂章…',
        imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/76/0010627615.jpg&v=5315ab5f&w=348&h=348'
    },
];