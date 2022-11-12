const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const User = require('./user.js');
 
 const PORT = 4000;

 const app = express();
 app.use(session({
    secret:"asdasdfc",
    resave:false,
    saveUninitialized:true,
    cookie: { maxAge: 60 * 60* 1000 }
 }));

 app.use(bodyParser.urlencoded({ extended :false}));
 app.use(passport.initialize());
 app.use(passport.session());

 passport.use(User.createStrategy());
 
// passport.use(new LocalStrategy(
//     function (username,password,done){
//         User.findOne({username:username },function(err,user){
//             if(err){return done(err);}
//             if(!user){return done(null, false,{ message:"User not found"});}
//             if(!user.verifyPassword(password)){return done(null, false, {message: "Password did not match!"});}
//             return done(null, user);
//         });
//     }
// ));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());


app.get('/',(req,res) => {
    res.sendFile(__dirname + '/static/index.html');
});

app.get('/login',(req,res)=>{
    res.sendFile(__dirname + '/static/login.html');
});

app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(),(req,res)=>{
    res.send(`hello ${req.user.username}!`);
});
app.get('/secret',(req,res)=>{
    res.sendFile(__dirname + '/static/secret.html');
});
app.get('/logout',function (req,res){
    req.logout();
    res.redirect('/login');
});
app.post('/login' ,passport.authenticate('local',{failureRedirect: '/'}),function(req,res) {
    console.log(req.user);
    res.redirect('/dashboard');
});
app.listen(PORT ,()=> console.log(`server is listening on ${PORT}`))