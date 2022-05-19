const Sequelize = require('sequelize');

////////////////////////////////////////////////////////////
//連接資料庫
const database = new Sequelize('demo', 'root', 'fn102', {
    dialect: 'mysql', 
    host: 'localhost'
});

// const database = new Sequelize ('demo', 'admin', 'admin', {
// 	dialect: 'mysql',
// 	host: '130.211.120.155'
// });

module.exports = database;//導出資料庫並模組化