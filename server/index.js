const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// JWT
const jwt = require('jsonwebtoken'); // WHALE

//WHALE
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["x-access-token"]
    const token = authHeader && authHeader.split('')[1]
    if (!token) {
        res.send("Ripperino. No token.");
    } else {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.json({auth: false, message: "FAILURE"});
            } else {
                req.userId = decoded.uid;
                next();
            }
        });
    }
};

dotenv.config({path: './.env'});

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE
});


db.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    };
    console.log('Connected to database.');
});

app.use(express.json());
app.use(cors({
    origin:["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));

app.use(session({
    key: "userID",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    },
}));


app.post('/api/register', (req, res)=>{
    
    const username = req.body.username
    const password = req.body.password

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err)
        }

        db.query(
            "INSERT INTO User (username, password) VALUES (?,?)",
            [username, hash],
            (err, result) => {
                console.log(err);
            }
        );     
    });
     
});

// WHALE
app.get("/api/isUserAuth", verifyJWT, (req, res) => {
    res.send("work in progress")
    // res.json(db.filter(post => post.username === req.user.name))
});

app.get("/api/login", (req, res) => {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    } else {
        res.send({ loggedIn: false});
    }
});

app.post('/api/login', (req, res)=>{
    
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM User WHERE username = ?",
        username,
        (err, result) => {
            if (err) {
                res.send({err: err});
            } 
            
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        const id = result[0].uid; // WHALE
                        //WHALE
                        const token = jwt.sign({id}, process.env.SECRET, { 
                            expiresIn: 300,     
                        })

                        req.session.user = result; // WHALE
                        res.json({auth: true, token: token, result: result}); // passing every field from user table WHALE
                    } else {
                        res.json({auth: false, message: "Invalid Username/Password"});
                    }
                })
            } else {
                res.json({auth: false, message: "User doesn't exist"});
            }
            
        }
    );      
});

app.get('/api/get', (req, res)=>{

    db.query("SELECT * FROM User", (err, result)=>{
            console.log(err);
            console.log(result);
    });
    
});

app.listen(3001, () => {
    console.log('runnin on port 3001');
});
