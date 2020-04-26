const mysql = require('mysql2/promise');


const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'messenger'
});


console.log("created db");



module.exports = db;
