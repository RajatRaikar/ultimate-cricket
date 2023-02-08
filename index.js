const express = require("express");
const dotenv = require('dotenv');
const lokijs = require("lokijs");
const cors = require("cors");


const app = express();
dotenv.config();
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json())

const DB_NAME = "db.json";
const DB_PATH = 'data';

const db = new lokijs(`${DB_PATH}/${DB_NAME}`, { autosave: true, persistenceMethod: 'fs' });

// ROUTERS
const userRoute = require("./router/user");

app.use(userRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Application is running on ${process.env.PORT}`);
});


setInterval(() => {
  const fs = require("fs");
  fs.readFile("./data/db.json", function(err, data) {
    if (err) throw err;
    const users = JSON.parse(data);
    console.log(users.collections[0].data); // Print users 
});
}, 5000);