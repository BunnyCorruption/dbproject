const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');


const db = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    port: '',
    database: 'e'
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

app.post('/api/insert', (req, res)=>{

    const userr = req.body.usery;
    const pass = req.body.passy;
    
    const sqlInsert = `INSERT INTO User (username, password) VALUES ('${userr}','${pass}')`;
     db.query(sqlInsert, (err, result)=>{
             console.log(err);

     });
    res.send();
       
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
