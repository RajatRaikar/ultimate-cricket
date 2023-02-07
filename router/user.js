const express = require("express");
const inputValidator = require("../helper/validator");
const lokijs = require("lokijs");
const jsonWebToken = require("jsonwebtoken");

// DB LOAD
const DB_NAME = "db.json";
const DB_PATH = "data";

let userCollection;

const db = new lokijs(`${DB_PATH}/${DB_NAME}`, {
  autosave: true,
  persistenceMethod: "fs",
});

db.loadDatabase({}, () => {
  userCollection = db.getCollection("users");
  if (!userCollection) {
    db.addCollection("users");
    userCollection = db.getCollection("users");
  }
});

const router = express.Router();

router.post("/user/register", async (req, res) => {
  try {
    console.log(req.body, '/user/register');
    const errorObj = inputValidator.validateInputs(
      req.body.email,
      req.body.password,
      req.body.name,
      req.body.repeat_password
    );

    if (Object.keys(errorObj).length > 0) {
      return res.send({
        response_code: 201,
        response_message: "error",
        response_data: {errorObj}
      });
    }

    let user = userCollection.find({ email: req.body.email })[0];
    if (user) {
      return res.send({
        response_code: 202,
        response_message: "email id exist",
        response_data: {},
      });
    }

    const accessToken = await jsonWebToken.sign({email: req.body.email}, 'ultimate-cricket');
    console.log(accessToken);
    user = userCollection.insert({
      email: req.body.email,
      password: req.body.password,
      access_token: accessToken,
      name: req.body.name,
      profile: 14,
      match_played: 0,
      match_wins: 0,
      hundred: 0,
      fifty: 0,
      coin: 0,
    });

    return res.send({
      response_code: 200,
      response_message: "success",
      response_data: {
        email: user.email,
        access_token: user.access_token
      },
    });
  } catch (e) {
    console.log(e);
    res.send({
      reponse_code: 500,
      response_message: "something went wrong",
      response_data: {},
    });
  }
});

router.get("/user/detail", async (req, res) => {
  try {
    console.log(req.query);
    const errorObj = inputValidator.validateInputs(req.query.email);

    if (Object.keys(errorObj).length > 0) {
      return res.send(errorObj);
    }

    let user = userCollection.find({ email: req.query.email })[0];
    if (user) {
      return res.send({
        response_code: 200,
        response_message: "success",
        response_data: {
          user
        },
      });
    }

    return res.send({
      response_code: 203,
      response_message: "user doesnt exist",
      response_data: {},
    });

  } catch (e) {
    console.log(e);
    res.send({
      reponse_code: 500,
      response_message: "something went wrong",
      response_data: {},
    });
  }
});

router.post("/user/login", async(req, res) => {
  try {
    const errorObj = inputValidator.validateInputs(
      req.body.email,
      req.body.password,
    );

    if (Object.keys(errorObj).length > 0) {
      return res.send({
        response_code: 201,
        response_message: "error",
        response_data: {errorObj}
      });
    }

    let user = userCollection.find({ email: req.body.email, password: req.body.password })[0];
    if (user) {
      return res.send({
        response_code: 202,
        response_message: "success",
        response_data: { access_token: user.access_token },
      });
    }

    res.send({
      response_code: 203,
      response_message: "user not exist",
      response_data: {},
    })
  } catch (e) {
    console.log(e);
    res.send({
      reponse_code: 500,
      response_message: "something went wrong",
      response_data: {},
    });
  }
});

router.post("/user/update", async (req, res) => {
  try {
    console.log(req.body, '=========user/update========');
    /*
    "match_played": 0,
                    "match_wins": 0,
                    "hundred": 0,
                    "fifty": 0,
                    "coin": 12,
    */
    let user = userCollection.find({ email: req.body.email })[0];
    console.log(user, '=====user - update=======');

    user.match_played = user.match_played + 1;
    user.match_wins = req.body.is_win == 1 ? user.match_wins + 1 : user.match_wins;
    user.hundred = req.body.score >= 100 ? user.hundred + 1 : user.hundred;
    user.fifty = req.body.score >=50 && req.body.score <=100 ? user.fifty + 1 : user.fifty;
    user.coin = user.coin + 10;
    userCollection.update(user);

    return res.send({
      response_code: 200,
      response_message: "success",
      response_data: {},
    });
    
  } catch (e) {
    console.log(e);
    res.send({
      reponse_code: 500,
      response_message: "something went wrong",
      response_data: {},
    });
  }
})

module.exports = router;
