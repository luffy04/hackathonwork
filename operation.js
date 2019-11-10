const bcrypt = require('bcryptjs');
const database = require('./database');
const saltRounds = 10;
function encrypt(username, email,password, cb) {
    console.log("operations")
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            database.signUp(username, email,hash, function(err,data) {
                if(err) cb(err)
                else{
                    database.setImage(username,function (err,data) {
                        cb(data);
                    })
                }
            })
        });
    });
}

function compare(password, hash, cb) {
    bcrypt.compare(password, hash, function(err, res) {
        cb(res);
    });
}

function compared(password, hash, cb) {
    bcrypt.compare(password, hash, function(err, res) {
        cb(err,res);
    });
}

function trwe(username,password,cb){
    console.log(username);
    bcrypt.genSalt(saltRounds,function(err,salt){
        bcrypt.hash(password,salt,function(err,hash){
            database.renew(username,hash,function(data){
                cb(data);
            })
        })
    })
}

function display(connection, cb) {
    connection.query('SELECT * FROM task', function (error, results, fields) {
        if (error) throw error;
        cb(results);
    });

}

function deleteItem(connection, id, cb) {
    connection.query(`DELETE FROM task WHERE ID = ${id}`, function (error, results) {
        cb(error, results);
    });

}

module.exports = {
    encrypt,
    compare,
    display,
    trwe,
    //insert,
    compared,
    deleteItem,
    //signUp
    //  usertable
};
