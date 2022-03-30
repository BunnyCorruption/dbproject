const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
                        res.send(result)
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

app.post

app.listen(3001, () => {
    console.log('runnin on port 3001');
});
