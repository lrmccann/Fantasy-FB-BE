const router = require("express").Router();
const usersController = require("../controller/controller");
// const { User } = require("../model/index");
// const auth = require("../controllers/middlewere/session-trecker");
const db = require('../model/index');
var axios = require("axios").default;

const createSessiontoken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


router.get('/hello', async (req, res) => {
  await db.User
    .find({})
    .map(function (data) {
      // return res.send(data)
      return res.json(data)
    })

  router.get('/seasons', async (req, res) => {
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
      //   console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  })

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
      //   console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  })

  router.get("/authenticate/:id1/:id2", async (req, res) => {
    console.log(req.params.id1, "username")
    var username = req.params.id1
    console.log(req.params.id2, "password")
    var password = req.params.id2
    let account = await db.User
      .findOne({ 'userData.userName': username })
      .catch((error)=> {
        console.log(error)
      })
    console.log(account, "this is account")
    if(password === account.password){
      console.log("password DID match")
      const token = createSessiontoken();
      console.log(token , "i am session token")
      await db.User.findOneAndUpdate(
        { 'userData.userName': username },
        { 'userData.sessionToken': token },
        { new: true },    //Set new option to true to return the document AFTER update was applied.
        {useFindAndModify : false}
      )
        .then(result => res.json(result.userData))
        .catch((error) => {
          console.log(error)
        })
    } if(!account){
      res.json("Incorrect username, try again")
    }else{
      res.json("Incorrect password, try again")
    }
  })

})

module.exports = router;