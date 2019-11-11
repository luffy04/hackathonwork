const express=require('express');
const app=express();
const database=require('./database.js');
const operations=require('./operation');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bodyParser = require('body-parser');
const ejs=require('ejs');
const http=require('http');
const fs=require('fs');
const session = require('express-session');
var server = http.createServer(app);
// const socket=require('socket.io');
const io=require('socket.io').listen(server);
var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

app.use('/',express.static('public'));
app.use(bodyParser.urlencoded({limit:'50mb', extended: true }));
app.use(bodyParser.json({limit:'50mb'}));
app.use(session({secret: 'I have a dog',resave:true,saveUninitialized:true}));

app.use(passport.initialize());
app.use(passport.session());


app.post('/login', passport.authenticate('local',{
    successRedirect:'/work',
    failureRedirect:'/failure'
}));

passport.use(new LocalStrategy(
    function(username, password, done) {
        database.getUser(username, function(data) {
            console.log(username);
            if(data==""){
                return done(null,false,{message:"username is incorrect"});
            }
            else{
                // console.log(data[0].ema);
                operations.compare(password, data[0].password, function(show){
                    if(!show) {
                        return done(null, false, {message: 'password is incorrect'});
                    }
                    io.on('connection',function (socket) {
                        socket.emit('data',data[0].username,data[0].email)
                    });
                    return done(null, data[0]);
                });
            }
        })
    })
);

passport.serializeUser(function(id, done) {
    return done(null, id);
});

passport.deserializeUser(function(id, done) {
    return done(null, id)
});

app.get('/work', function(req,res) {
    v=req.user;
    console.log(req.user);

    res.render("index.ejs",{
        name:req.user
    });
});

app.get('/failure', function(req,res) {
    req.logout();
    console.log("failure");
    res.redirect("/login");
});

app.post('/register',function(req,res){
    operations.encrypt(req.body.user,req.body.mail,req.body.pass,function (data) {
        res.send(data);
    })
})

app.post('/send',function (req,res) {
    database.set(req.body.user,req.body.text,req.body.pin,req.body.reminder,req.body.color,req.body.title,false,function (data) {
        res.send(data);
    })
})

app.post('/recovery',function (req,res) {
    database.getUser(req.body.username, function(data) {
        if(data==""){
            res.send("error");
        }
        else{
            // console.log(data[0].ema);
            if(req.body.email==data[0].email){
                res.send("success");
            }else{
                res.send("error");
            }
        }
    })
})

app.post('/update',function (req,res) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.pass, salt, function(err, hash) {
            database.update(req.body.username,hash,function (data) {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user:'aryanjha82.aj55@gmail.com',
                        pass:'ronoroazoro1'
                    }
                });
                var mailOptions = {
                    from: '"Error" <aryanjha82.aj55@gmail.com>',
                    to: "anujjha041998@gmail.com",
                    subject: 'Password Recovery',
                    text:`${req.body.pass}`
                };
                transporter.sendMail(mailOptions,function(error, info){
                    if (error) {
                        res.send(error);
                    } else {
                        res.send(info);
                    }init
                });
            })
        })
    })

})

app.post('/data',function (req,res) {
    database.data(req.body.username,function (data) {
        res.send(data);
    })
})

io.on('connection',function (socket) {
    socket.emit('first','data');
    
    socket.on('userimage',function (image,name,user) {
        var data = image.replace(/^data:image\/\w+;base64,/, "");

        var buf = new Buffer(data, 'base64');

        fs.writeFile(`public/${name}`, buf);
        database.set(user,name,false,false,"white","",true,function (data) {
            console.log(name);
            socket.emit("myans",data,name);
        })
    })

})
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user:'aryanjha82.aj55@gmail.com',
//         pass:'ronoroazoro1'
//     }
// });
// var mailOptions = {
//     from: '"Error" <aryanjha82.aj55@gmail.com>',
//     to: req.body.Email,
//     subject: 'Password Recovery',
//     text:`${req.body.pass}`
// };
// transporter.sendMail(mailOptions,function(error, info){
//     if (error) {
//         res.send(error);
//     } else {
//         res.send(info);
//     }
// });


server.listen(8000,function(){
    console.log("Working");
})