const router = require("express").Router();
const bcrypt = require('bcrypt');
const usersController = require("../controller/controller");
// const auth = require("../controllers/middlewere/session-trecker");
const db = require('../model/index');
var axios = require("axios").default;

const createSessiontoken = () => {
   return  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const saltHash = async (pass) => {
  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync( pass, salt);
  console.log(salt , password , "I am the result of the stuff for bcrypt")
  return {password , salt}
}

router.get('/hello', async (req, res) => {
  await db.User
    .find({})
    .map(function (data) {
      // return res.send(data)
      return res.json(data)
    })
  });

        // get all players for player page
  router.get('/getAllPlayers', async (req, res) => {
    var options = {
      method: 'GET',
      url: 'https://api.sportsdata.io/v3/nfl/scores/json/Players?key=12afde5143164914a73228616f79c12f',
      headers: {
        "Ocp-Apim-Subscription-Key": "12afde5143164914a73228616f79c12f"
      }
    };
    axios.request(options).then(function (response) {
      console.log(response)
      return res.json(response.data)
    }).catch(function (error) {
      console.error(error);
    });
  });

          // get games by week
  router.get('/gamesByWeek', async (req, res) => {
    var options = {
      method: 'GET',
      url: 'https://api.sportsdata.io/v3/nfl/scores/json/Schedules/2020?key=12afde5143164914a73228616f79c12f',
      headers: {
        "Ocp-Apim-Subscription-Key": "12afde5143164914a73228616f79c12f"
      }
    };
    axios.request(options).then(function (response) {
      console.log(response)
      return res.json(response.data)
    }).catch(function (error) {
      console.error(error);
    });
  })
  
          // Login user for login page
  router.get("/authenticate/:id1/:id2", async (req, res) => {
    console.log('request', req.params.id1)
    const password = req.params.id2;
    let account = await db.User
      .findOne({ 'userData.userName': req.params.id1 });
    console.log("account", account)
    if (account) {
      const passwordHash = account.password;
      let match = await bcrypt.compare(password, passwordHash);
      console.log("match", match)
      if (match) {
        const token = createSessiontoken()
        console.log("token", token)
        console.log("username", account.userData.userName);
        await db.User.findOneAndUpdate(
          { 'userData.userName': req.params.id1 },
          { 'userData.sessionToken': token },
          { new: true }    //You should set the new option to true to return the document after update was applied.
        )
          .then(result => res.json(result.userData))
      } else {
        res.json("Wrong password.")
      }
    } else {
      res.json("User not found.")
    }
  })

          // create account route for signup page, wanna split this into 
          // two later
router.post('/createAccount' , async (req, res) => {
  console.log("req boooodddyyy", req.body)
  console.log("req body usernaaaammmeee" , req.body.userData.userName)
  const account = await db.User.findOne({ 'userData.userName': req.body.userData.userName });
  console.log("account", account)
  if (!account) {
    const creds = await saltHash(req.body.password);
    const token = createSessiontoken();
    req.body.password = creds.password;
    req.body.salt = creds.salt;
    req.body.userData.sessionToken = token;
    console.log("session token being created" , token)
    console.log(req.body , "i am request body after the first if conditional")
    await db.User.create(req.body)
      .then(result => res.json(result.userData) )
  } else {
    res.json("User name already taken.")
  }
})

router.get('/getSingleUser/:id1' , async (req, res) => {
  console.log(req.body , "i am request boooooddy")
  console.log(req.params , "i am request paraaaaaams")
  console.log(req , "i am reguuuular request")
})

module.exports = router;