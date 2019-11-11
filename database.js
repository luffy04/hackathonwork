var mysql      = require('mysql');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Monkeydluffy1',
    database : 'testdb'
});
function connectDB(){
    connection.connect();
}

function signUp(username,email,password,cb){
    // var newone =
    // console.log(newone);
    connection.query(`Insert into login(username,email,password) values('${username}','${email}','${password}')`,function(results,fields,error){
          connection.query(`Create table ${username}(id integer primary key auto_increment,message varchar(200),pin varchar(10),reminder varchar(10),color varchar(10),title varchar(30))`,function (error,results,fields) {
                cb(error,results);
              }
          )
    })
}
function setImage(username,cb){
    connection.query(`Insert into profile(username,pic) values('${username}','nf/user3.jpeg')`,function(error,results,fields){
        cb(error,results);
    })
}

function update(username,password,cb){
    connection.query(`Update login set password='${password}' where username='${username}'`,function (error,results,fields) {
        cb(results);
    })
}

function getUser(username,cb){
    connection.query(`select * from login where username='${username}'`,function(error,results,fields){
        cb(results);
    })
}

function set(username,text,pin,reminder,color,title,image,cb){
    connection.query(`Insert into ${username} (message,pin,reminder,color,title,image) values('${text}','${pin}','${reminder}','${color}','${title}','${image}')`,function (error,results,fields) {
        cb(results);
    })
}

function data(user,cb){
    connection.query(`Select * from ${user}`,function (error,results,fields) {
        cb(results);
    })
}

function profile(pic,username,cb){
    connection.query(`update profile set pic='${pic}' where username='${username}'`,function(error,results,fields){
        cb(results)
    })
}


module.exports = {
    connectDB,
    signUp,
    data,
    getUser,
    setImage,
    update,
    set,

};
