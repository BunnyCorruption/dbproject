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

const jwt = require('jsonwebtoken');


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

app.get("/api/login", (req, res) => {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    } else {
        res.send({ loggedIn: false});
    }
});

app.post('/api/login', (req, res)=>{
    
    const username = req.body.username
    const password = req.body.password

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
                        const id = result[0].id;
                        const token = jwt.sign({id}, process.env.SECRET, {
                            expiresIn: 300,     
                        })

                        req.session.user = result;
                        res.send(result);
                    } else {
                        res.send({message: "Invalid Username/Password"});
                    }
                })
            } else {
                res.send({message: "User doesn't exist"});
            }
            
        }
    );      
});

app.get('/api/get', (req, res)=>{

    db.query("SELECT * FROM user", (err, result)=>{
            console.log(err);
            console.log(result);
    });
    
});

app.listen(3001, () => {
    console.log('runnin on port 3001');
});
