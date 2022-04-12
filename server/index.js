const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const dotenv = require("dotenv");
const puppeteer = require('puppeteer');


const bcrypt = require("bcrypt");
const saltRounds = 10;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// JWT
const jwt = require("jsonwebtoken"); // WHALE---------------

//WHALE
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["x-access-token"];
  const token = authHeader && authHeader.split("")[1];
  if (!token) {
    res.send("Ripperino. No token.");
  } else {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "FAILURE" });
      } else {
        req.userId = decoded.uid;
        next();
      }
    });
  }
};

dotenv.config({ path: "./.env" });

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE,
});

db.connect(function (err) {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    key: "userID",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

app.post("/api/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO User (username, password, role) VALUES (?,?,?)",
      [username, hash, role],
      (err, result) => {
        console.log(err);
      }
    );
  });
});

// WHALE
app.get("/api/isUserAuth", verifyJWT, (req, res) => {
  res.send("work in progress");
  // res.json(db.filter(post => post.username === req.user.name))
});

app.get("/api/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  db.query("SELECT * FROM User WHERE username = ?", [username], (err, result) => {
    if (err) {
      res.send({ err: err });
    }

    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          const id = result[0].uid; // WHALE
          //WHALE
          const token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 300,
          });

          req.session.user = result; // WHALE
          res.json({ auth: true, token: token, result: result }); // passing every field from user table WHALE
        } else {
          res.json({ auth: false, message: "Invalid Username/Password" });
        }
      });
    } else {
      res.json({ auth: false, message: "User doesn't exist" });
    }
  });
});

app.get("/api/get", (req, res) => {
  db.query("SELECT * FROM User", (err, result) => {
    console.log(err);
    console.log(result);
  });
});

app.get("/api/get/rso", (req, res) => {
  db.query("SELECT * FROM RSO", (err, result) => {
    //console.log(result);
    return res.json(result);
  });
});

app.post("/api/event", (req, res) => {
  const eName = req.body.eName;
  const time = req.body.time;
  const description = req.body.description;
  const privacy = req.body.privacy;

  app.get("/api/get/event", (req, res) => {
    db.query("SELECT * FROM Events", (err, result) => {
      //console.log(result);
      return res.json(result);
    });
  });  

  db.query(
    `INSERT INTO Events (name, time, description, privacy) VALUES ('${eName}','${time}','${description}','${privacy}')`,
    (err, result) => {
      if(err)
      console.log(err);
    }
  );
  return res;
});

app.post("/api/post/rso", (req, res) => {
  const newrso = req.body.newrso;
  console.log(newrso);
  const sqlInsert = `INSERT INTO RSO (name, count) VALUES ('${newrso}', 1)`;
  db.query(sqlInsert, (err, result) => {
    if(err)
    console.log(err);
    
  });
});

async function scrapeProduct(url){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [el] = await page.$x('//*[@id="calendar-events-day"]/ul/li[1]/h3/a');
  const txt = await el.getProperty('textContent')
  const rawTxt = await txt.jsonValue();

  const [el1] = await page.$x('//*[@id="calendar-events-day"]/ul/li[1]/time[1]/span[2]');
  const txt1 = await el1.getProperty('textContent')
  const rawTxt1 = await txt1.jsonValue();

  const [el2] = await page.$x('//*[@id="calendar-events-day"]/ul/li[1]/div');
  const txt2 = await el2.getProperty('textContent')
  const rawTxt2 = await txt2.jsonValue();

  const [el3] = await page.$x('//*[@id="calendar-events-day"]/ul/li[1]/p/text()');
  const txt3 = await el3.getProperty('textContent')
  const rawTxt3 = await txt3.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt}','${rawTxt1}','${rawTxt2}','${rawTxt3}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(result);
    }
  );

  const [el4] = await page.$x('//*[@id="calendar-events-day"]/ul/li[2]/h3/a');
  const txt4 = await el4.getProperty('textContent')
  const rawTxt4 = await txt4.jsonValue();

  const [el5] = await page.$x('//*[@id="calendar-events-day"]/ul/li[2]/time[1]/span[2]');
  const txt5 = await el5.getProperty('textContent')
  const rawTxt5 = await txt5.jsonValue();

  const [el6] = await page.$x('//*[@id="calendar-events-day"]/ul/li[2]/div');
  const txt6 = await el6.getProperty('textContent')
  const rawTxt6 = await txt6.jsonValue();

  const [el7] = await page.$x('//*[@id="calendar-events-day"]/ul/li[2]/p/text()');
  const txt7 = await el7.getProperty('textContent')
  const rawTxt7 = await txt7.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt4}','${rawTxt5}','${rawTxt6}','${rawTxt7}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(result);
    }
  );

  const [el8] = await page.$x('//*[@id="calendar-events-day"]/ul/li[3]/h3');
  const txt8 = await el8.getProperty('textContent')
  const rawTxt8 = await txt8.jsonValue();

  const [el9] = await page.$x('//*[@id="calendar-events-day"]/ul/li[3]/time[1]');
  const txt9 = await el9.getProperty('textContent')
  const rawTxt9 = await txt9.jsonValue();

  const [el10] = await page.$x('//*[@id="calendar-events-day"]/ul/li[3]/div');
  const txt10 = await el10.getProperty('textContent')
  const rawTxt10 = await txt10.jsonValue();

  const [el11] = await page.$x('//*[@id="calendar-events-day"]/ul/li[3]/p');
  const txt11 = await el11.getProperty('textContent')
  const rawTxt11 = await txt11.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt8}','${rawTxt9}','${rawTxt10}','${rawTxt11}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(rawTxt);
    }
  );

  //console.log({rawTxt, rawTxt1, rawTxt2, rawTxt3, rawTxt4, rawTxt5, rawTxt6, rawTxt7, rawTxt8, rawTxt9, rawTxt10, rawTxt11});

  browser.close();
  }
async function scrapeProduct1(url){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [el] = await page.$x('//*[@id="calendar-events-day"]/ul/li[4]/h3/a');
  const txt = await el.getProperty('textContent')
  const rawTxt = await txt.jsonValue();

  const [el1] = await page.$x('//*[@id="calendar-events-day"]/ul/li[4]/time[1]/span[2]');
  const txt1 = await el1.getProperty('textContent')
  const rawTxt1 = await txt1.jsonValue();

  const [el2] = await page.$x('//*[@id="calendar-events-day"]/ul/li[4]/div');
  const txt2 = await el2.getProperty('textContent')
  const rawTxt2 = await txt2.jsonValue();

  const [el3] = await page.$x('//*[@id="calendar-events-day"]/ul/li[4]/p/text()');
  const txt3 = await el3.getProperty('textContent')
  const rawTxt3 = await txt3.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt}','${rawTxt1}','${rawTxt2}','${rawTxt3}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(result);
    }
  );

  const [el4] = await page.$x('//*[@id="calendar-events-day"]/ul/li[5]/h3/a');
  const txt4 = await el4.getProperty('textContent')
  const rawTxt4 = await txt4.jsonValue();

  const [el5] = await page.$x('//*[@id="calendar-events-day"]/ul/li[5]/time[1]/span[2]');
  const txt5 = await el5.getProperty('textContent')
  const rawTxt5 = await txt5.jsonValue();

  const [el6] = await page.$x('//*[@id="calendar-events-day"]/ul/li[5]/div');
  const txt6 = await el6.getProperty('textContent')
  const rawTxt6 = await txt6.jsonValue();

  const [el7] = await page.$x('//*[@id="calendar-events-day"]/ul/li[5]/p/text()');
  const txt7 = await el7.getProperty('textContent')
  const rawTxt7 = await txt7.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt4}','${rawTxt5}','${rawTxt6}','${rawTxt7}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(result);
    } 
  );

  const [el8] = await page.$x('//*[@id="calendar-events-day"]/ul/li[6]/h3/a');
  const txt8 = await el8.getProperty('textContent')
  const rawTxt8 = await txt8.jsonValue();

  const [el9] = await page.$x('//*[@id="calendar-events-day"]/ul/li[6]/time[1]/span[2]');
  const txt9 = await el9.getProperty('textContent')
  const rawTxt9 = await txt9.jsonValue();

  const [el10] = await page.$x('//*[@id="calendar-events-day"]/ul/li[6]/div');
  const txt10 = await el10.getProperty('textContent')
  const rawTxt10 = await txt10.jsonValue();

  const [el11] = await page.$x('//*[@id="calendar-events-day"]/ul/li[6]/p/text()');
  const txt11 = await el11.getProperty('textContent')
  const rawTxt11 = await txt11.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt8}','${rawTxt9}','${rawTxt10}','${rawTxt11}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(result);
    }
  );

  //console.log({rawTxt, rawTxt1, rawTxt2, rawTxt3, rawTxt4, rawTxt5, rawTxt6, rawTxt7, rawTxt8, rawTxt9, rawTxt10, rawTxt11});

  browser.close();
}


async function scrapeProduct2(url){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);
  await page.goto(url);

  const [el] = await page.$x('//*[@id="calendar-events-day"]/ul/li[7]/h3/a');
  const txt = await el.getProperty('textContent')
  const rawTxt = await txt.jsonValue();

  const [el1] = await page.$x('//*[@id="calendar-events-day"]/ul/li[7]/time[1]/span[2]');
  const txt1 = await el1.getProperty('textContent')
  const rawTxt1 = await txt1.jsonValue();

  const [el2] = await page.$x('//*[@id="calendar-events-day"]/ul/li[7]/div');
  const txt2 = await el2.getProperty('textContent')
  const rawTxt2 = await txt2.jsonValue();

  const [el3] = await page.$x('//*[@id="calendar-events-day"]/ul/li[7]/p/text()');
  const txt3 = await el3.getProperty('textContent')
  const rawTxt3 = await txt3.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt}','${rawTxt1}','${rawTxt2}','${rawTxt3}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(result);
    }
  );

  const [el4] = await page.$x('//*[@id="calendar-events-day"]/ul/li[8]/h3/a');
  const txt4 = await el4.getProperty('textContent')
  const rawTxt4 = await txt4.jsonValue();

  const [el5] = await page.$x('//*[@id="calendar-events-day"]/ul/li[8]/time[1]/span[2]');
  const txt5 = await el5.getProperty('textContent')
  const rawTxt5 = await txt5.jsonValue();

  const [el6] = await page.$x('//*[@id="calendar-events-day"]/ul/li[8]/div');
  const txt6 = await el6.getProperty('textContent')
  const rawTxt6 = await txt6.jsonValue();

  const [el7] = await page.$x('//*[@id="calendar-events-day"]/ul/li[8]/p');
  const txt7 = await el7.getProperty('textContent')
  const rawTxt7 = await txt7.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt4}','${rawTxt5}','${rawTxt6}','${rawTxt7}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(result);
    }
  );

  /*const [el8] = await page.$x('//*[@id="calendar-events-day"]/ul/li[9]/h3/a');
  const txt8 = await el8.getProperty('textContent')
  const rawTxt8 = await txt8.jsonValue();

  const [el9] = await page.$x('//*[@id="calendar-events-day"]/ul/li[9]/time[1]/span[2]');
  const txt9 = await el9.getProperty('textContent')
  const rawTxt9 = await txt9.jsonValue();

  const [el10] = await page.$x('//*[@id="calendar-events-day"]/ul/li[9]/div');
  const txt10 = await el10.getProperty('textContent')
  const rawTxt10 = await txt10.jsonValue();

  const [el11] = await page.$x('//*[@id="calendar-events-day"]/ul/li[9]/p/text()');
  const txt11 = await el11.getProperty('textContent')
  const rawTxt11 = await txt11.jsonValue();*/

  //console.log({rawTxt, rawTxt1, rawTxt2, rawTxt3, rawTxt4, rawTxt5, rawTxt6, rawTxt7, /*rawTxt8, rawTxt9, rawTxt10, rawTxt11*/});

  browser.close();
}

async function scrapeProduct3(url){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [el] = await page.$x('//*[@id="calendar-events-day"]/ul/li[10]/h3/a');
  const txt = await el.getProperty('textContent')
  const rawTxt = await txt.jsonValue();

  const [el1] = await page.$x('//*[@id="calendar-events-day"]/ul/li[10]/time[1]/span[2]');
  const txt1 = await el1.getProperty('textContent')
  const rawTxt1 = await txt1.jsonValue();

  const [el2] = await page.$x('//*[@id="calendar-events-day"]/ul/li[10]/div');
  const txt2 = await el2.getProperty('textContent')
  const rawTxt2 = await txt2.jsonValue();

  const [el3] = await page.$x('//*[@id="calendar-events-day"]/ul/li[10]/p/text()');
  const txt3 = await el3.getProperty('textContent')
  const rawTxt3 = await txt3.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt}','${rawTxt1}','${rawTxt2}','${rawTxt3}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(result);
    }
  );

  const [el4] = await page.$x('//*[@id="calendar-events-day"]/ul/li[11]/h3/a');
  const txt4 = await el4.getProperty('textContent')
  const rawTxt4 = await txt4.jsonValue();

  const [el5] = await page.$x('//*[@id="calendar-events-day"]/ul/li[11]/time[1]/span[2]');
  const txt5 = await el5.getProperty('textContent')
  const rawTxt5 = await txt5.jsonValue();

  const [el6] = await page.$x('//*[@id="calendar-events-day"]/ul/li[11]/div');
  const txt6 = await el6.getProperty('textContent')
  const rawTxt6 = await txt6.jsonValue();

  const [el7] = await page.$x('//*[@id="calendar-events-day"]/ul/li[11]/p/text()');
  const txt7 = await el7.getProperty('textContent')
  const rawTxt7 = await txt7.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt4}','${rawTxt5}','${rawTxt6}','${rawTxt7}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(result);
    }
  );

  const [el8] = await page.$x('//*[@id="calendar-events-day"]/ul/li[12]/h3/a');
  const txt8 = await el8.getProperty('textContent')
  const rawTxt8 = await txt8.jsonValue();

  const [el9] = await page.$x('//*[@id="calendar-events-day"]/ul/li[12]/time[1]/span[2]');
  const txt9 = await el9.getProperty('textContent')
  const rawTxt9 = await txt9.jsonValue();

  const [el10] = await page.$x('//*[@id="calendar-events-day"]/ul/li[12]/div');
  const txt10 = await el10.getProperty('textContent')
  const rawTxt10 = await txt10.jsonValue();

  const [el11] = await page.$x('//*[@id="calendar-events-day"]/ul/li[12]/p/text()');
  const txt11 = await el11.getProperty('textContent')
  const rawTxt11 = await txt11.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt8}','${rawTxt9}','${rawTxt10}','${rawTxt11}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(result);
    }
  );

  //console.log({rawTxt, rawTxt1, rawTxt2, rawTxt3, rawTxt4, rawTxt5, rawTxt6, rawTxt7, rawTxt8, rawTxt9, rawTxt10, rawTxt11});

  browser.close();
}

async function scrapeProduct4(url){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [el] = await page.$x('//*[@id="calendar-events-day"]/ul/li[13]/h3/a');
  const txt = await el.getProperty('textContent')
  const rawTxt = await txt.jsonValue();

  const [el1] = await page.$x('//*[@id="calendar-events-day"]/ul/li[13]/time[1]/span[2]');
  const txt1 = await el1.getProperty('textContent')
  const rawTxt1 = await txt1.jsonValue();

  const [el2] = await page.$x('//*[@id="calendar-events-day"]/ul/li[13]/div');
  const txt2 = await el2.getProperty('textContent')
  const rawTxt2 = await txt2.jsonValue();

  const [el3] = await page.$x('//*[@id="calendar-events-day"]/ul/li[13]/p/text()');
  const txt3 = await el3.getProperty('textContent')
  const rawTxt3 = await txt3.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt}','${rawTxt1}','${rawTxt2}','${rawTxt3}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(result);
    }
  );

  const [el4] = await page.$x('//*[@id="calendar-events-day"]/ul/li[14]/h3/a');
  const txt4 = await el4.getProperty('textContent')
  const rawTxt4 = await txt4.jsonValue();

  const [el5] = await page.$x('//*[@id="calendar-events-day"]/ul/li[14]/time[1]/span[2]');
  const txt5 = await el5.getProperty('textContent')
  const rawTxt5 = await txt5.jsonValue();

  const [el6] = await page.$x('//*[@id="calendar-events-day"]/ul/li[14]/div');
  const txt6 = await el6.getProperty('textContent')
  const rawTxt6 = await txt6.jsonValue();

  const [el7] = await page.$x('//*[@id="calendar-events-day"]/ul/li[14]/p/text()');
  const txt7 = await el7.getProperty('textContent')
  const rawTxt7 = await txt7.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt4}','${rawTxt5}','${rawTxt6}','${rawTxt7}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(result);
    }
  );

  const [el8] = await page.$x('//*[@id="calendar-events-day"]/ul/li[15]/h3/a');
  const txt8 = await el8.getProperty('textContent')
  const rawTxt8 = await txt8.jsonValue();

  const [el9] = await page.$x('//*[@id="calendar-events-day"]/ul/li[15]/time[1]/span[2]');
  const txt9 = await el9.getProperty('textContent')
  const rawTxt9 = await txt9.jsonValue();

  const [el10] = await page.$x('//*[@id="calendar-events-day"]/ul/li[15]/div');
  const txt10 = await el10.getProperty('textContent')
  const rawTxt10 = await txt10.jsonValue();

  const [el11] = await page.$x('//*[@id="calendar-events-day"]/ul/li[15]/p/text()');
  const txt11 = await el11.getProperty('textContent')
  const rawTxt11 = await txt11.jsonValue();

  db.query(
    `INSERT IGNORE INTO Events (name, time, description, privacy) VALUES ('${rawTxt8}','${rawTxt9}','${rawTxt10}','${rawTxt11}')`,
    (err, result) => {
      if(err)
      console.log(err);
      console.log(rawTxt8);
    }
  );

  //console.log({rawTxt, rawTxt1, rawTxt2, rawTxt3, rawTxt4, rawTxt5, rawTxt6, rawTxt7, rawTxt8, rawTxt9, rawTxt10, rawTxt11});

  browser.close();
}

scrapeProduct('https://events.ucf.edu');
scrapeProduct1('https://events.ucf.edu');
scrapeProduct2('https://events.ucf.edu');
scrapeProduct3('https://events.ucf.edu');
scrapeProduct4('https://events.ucf.edu');

app.listen(3001, () => {
  console.log("runnin on port 3001");
});

