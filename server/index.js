const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');

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

    db.query(
        "INSERT INTO User (username, password) VALUES (?,?)",
        [username, password],
        (err, result) => {
            console.log(err);
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
