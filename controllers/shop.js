const Product = require('../models/product');

////////////////////////////////////////////////////////////

//從mysql抓資料
const getIndex = (req, res) => {
    Product.findAll()
        .then((products) => {
            res.status(200)
                .render('index', {
                    path: '/',
                    pageTitle: 'Book Your Books online',
                    products: products
                });
        })
        .catch((err) => {
            console.log('Product.findAll() error: ', err);
        })
};
const getCart = (req, res) => {
    //抓app.js的req.user
    req.user
    //抓user的cart(在app裡已經說有Cart這個東西)
        .getCart()
        .then((cart) => {
            //在抓cart的產品
            return cart.getProducts()
                .then((products) => {
                    //在render的時候傳入參數
                    res.render('shop/cart', {
                        //會是[](空)或是有東西
                        products,
                        amount:cart.amount
                    });
                })
                .catch((err) => {
                    console.log('getCart - cart.getProducts error: ', err);
                })
        })
        .catch((err) => {
            console.log('getCart - user.getCart error', err);
        })
}

const postCartAddItem = (req, res) => {
    //req.body是透過form post傳回來的東西(form對應的key寫在name裡)
    //req.body傳回來的再用productId去接
    const { productId } = req.body;
    //userCart可能是[]或有多個
    let userCart;
    let newQuantity = 1;
    //找到sql的user後
    req.user
    //sql裡有Cart，就會有方法getCart(每個仁Cart只有一個)
        .getCart()
        .then((cart) => {
            userCart = cart;
            //在userCart裡抓product(product有多個，ID對應每個product)
            //檢查userCart有沒有該產品
            // id: productId 的productId是在form表單裡的name定義，再透過app.js的bodyParser解讀
            return cart.getProducts({ where: { id: productId }});
        })
        .then((products) => {
            let product;
            if (products.length > 0) {
                product = products[0];
                //有的話就把數量+1
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            //沒有的話就新增
            //productId是每個product的key
            return Product.findByPk(productId);
        })
        .then((product) => {
            //最後回傳新的數量
            return userCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        //下面這段在處理總額
        .then(() => {
            //先拿購物車裡所有產品
            return userCart.getProducts();
        })
        .then((products) => {
            //蒐集各個產品的數量*金額
            //map格式轉換
            const productsSums = products.map((product) => product.price * product.cartItem.quantity);
            //把上面得出的金額進行加總
            //reduce把陣列資料處理成結果
            const amount = productsSums.reduce((accumulator, currentValue) => accumulator + currentValue);
           //把上面的amount(後)放進該user的Cart定義的amount(前)
            userCart.amount = amount;
            //存入db
            return userCart.save();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log('postCartAddItem error: ', err);
        })
};
//移除商品
const postCartDeleteItem = (req, res, next) => {
    const { productId } = req.body;
    let userCart;
    req.user
        .getCart()
        .then((cart) => {
            userCart = cart;
            //抓productID
            return cart.getProducts({ where: { id: productId }});
        })
        .then((products) => {
            //有找到的話就拿找到的第一筆(也是唯一一筆)
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            return userCart
                .getProducts()
                .then((products) => {
                    if (products.length) {
                        const productSums = products.map((product) => product.price * product.cartItem.quantity);
                        const amount = productSums.reduce((accumulator, currentValue) => accumulator + currentValue);
                        userCart.amount = amount;
                        return userCart.save();
                    }
                });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch((err) => console.log(err));
};
//匯出函式
module.exports = {
    getIndex,
    getCart,
    postCartAddItem,
    postCartDeleteItem,
}

// const getIndex = (req, res) => {
//     res.status(200)
//         .render('index', {
//             path: '/',
//             pageTitle: 'Book Your Books online',
//             products
//         });
// };


// const products = [
//     {
//         title: '四月是你的謊言 1',
//         price: 80,
//         description: '有馬公生的母親一心想把有馬培育成舉世聞名的鋼琴家，而有馬也不負母親的期望，在唸小學時就贏得許多鋼琴比賽的大獎。11歲的秋天，有馬的母親過世，從此他再也聽不見自己彈奏的鋼琴聲，沮喪的他也只好放棄演奏，但在14歲那年，經由兒時玩伴的介紹，有馬認識了小提琴手宮園薰，並被薰的自由奔放吸引，沒想到薰竟開口邀請公生在比賽時擔任她的伴奏…',
//         imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/25/0010622563.jpg&v=52dcfd21&w=348&h=348'
//     },
//     {
//         title: '四月是你的謊言 2',
//         price: 80,
//         description: '公生答應在二次預賽中擔任小薰的鋼琴伴奏。比賽一開始公生還能順利彈琴，但在中途又再次因為聽不見鋼琴的聲音而停手。沒想到小薰也跟著停止演奏、等候公生。原本心灰意冷的公生因此重新振作，與小薰合奏出驚人的樂章…......',
//         imageUrl: 'https://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/31/0010623172.jpg&v=52dcfd21&w=348&h=348'
//     },
//     {
//         title: '四月是你的謊言 3',
//         price: 80,
//         description: '在小薰的逼迫之下，公生不得不參加音樂比賽。為了參加比賽，公生從早到晚不停的練習，但就是無法彈奏出屬於自己的巴哈與蕭邦。此時，公生的面前出現兩位強勁的對手-相座武士與井川繪見，他們曾經是公生的手下敗將，一心想在比賽中擊敗公生雪恥。先上台演奏的武士彈奏出令全場喝采的激昂樂章…',
//         imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/76/0010627615.jpg&v=5315ab5f&w=348&h=348'
//     },
// ];

// module.exports = {
//     getIndex
// }