const router = require("express").Router();
const usersController = require("../controller/controller");
// const auth = require("../controllers/middlewere/session-trecker");
const db = require('../model/index');
var axios = require("axios").default;


router.get('/hello' , async (req , res) => {
    await db.User
    .find({})
    .map(function(data) {
        // return res.send(data)
        return res.json(data)
    })

    router.get('/seasons' , async (req, res) => {
      var options = {
        method: 'GET',
        url: 'https://api.sportsdata.io/v3/nfl/scores/json/Players?key=12afde5143164914a73228616f79c12f',
        headers: {
          "Ocp-Apim-Subscription-Key" : "12afde5143164914a73228616f79c12f"
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

router.get('/gamesByWeek' , async (req, res) => {
  var options = {
    method: 'GET',
    url: 'https://api.sportsdata.io/v3/nfl/scores/json/Schedules/2020?key=12afde5143164914a73228616f79c12f',
    headers: {
      "Ocp-Apim-Subscription-Key" : "12afde5143164914a73228616f79c12f"
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

router.get("/authenticate/:id1/:id2" , async (req, res) => {
  console.log(req , "requueeessstttt")
  console.log(req.body , "req booooody")
  console.log(req.params , "req paaarrraaammmmssss")
})

})

    module.exports = router;