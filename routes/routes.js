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
    }).catch(function (error) {
      console.error(error);
    });
  })

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
          .then(result => res.json(result))
      } else {
        res.json("Wrong password.")
      }
    } else {
      res.json("User not found.")
    }
    // console.log(req.params.id1, "username")
    // var username = req.params.id1
    // console.log(req.params.id2, "password")
    // var password = req.params.id2
    // let account = await db.User
    //   .findOne({ 'userData.userName': username } , function(err , docs){
    //     if(err){
    //       console.log(err , "i am first error")
    //       // return res.json(err)
    //     }else{
    //       console.log(docs , "more docs to log i guess")
    //       // return res.json("it worked")
    //     }
    //   })
    //   let passwordFromDb = account.password
    //   if(password === passwordFromDb){
    //     console.log("successfully logged in")
    //     const token = createSessiontoken().toString()
    //     console.log(token , "this is session token")
    //     console.log(account._id, "i am zee account id")
    //     await db.User.findByIdAndUpdate(
    //         { '_id' : account._id},
    //       { 'userData.sessionToken': token },
    //       {'userFindAndModify' : false},
    //       { new: true }    //Set new option to true to return the document AFTER update was applied.
    //     )
    //     .then(res.json(token))
    //   }if(password !== passwordFromDb){
    //     return res.json("wrong password")
    //   }else{
    //     return res.json("wrong username")
    //   }
  })






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
    req.body.sessionToken = token;
    console.log("session token being created" , token)
    console.log(req.body , "i am request body after the first if conditional")
    await db.User.create(req.body)
      .then(result => res.json(result) )
  } else {
    res.json("User name already taken.")
  }
})

module.exports = router;