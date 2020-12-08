const router = require("express").Router();
const bcrypt = require('bcrypt');
const usersController = require("../controller/controller");
// const auth = require("../controllers/middlewere/session-trecker");
const db = require('../model/index');
var axios = require("axios").default;

const createSessiontoken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
    console.log(req.params.id1, "username")
    var username = req.params.id1
    console.log(req.params.id2, "password")
    var password = req.params.id2
    let account = await db.User
      .findOne({ 'userData.userName': username } , function(err , docs){
        if(err){
          console.log(err , "i am first error")
          // return res.json(err)
        }else{
          console.log(docs , "more docs to log i guess")
          // return res.json("it worked")
        }
      })
      let passwordFromDb = account.password
      if(password === passwordFromDb){
        console.log("successfully logged in")
        const token = createSessiontoken().toString()
        console.log(token , "this is session token")
        console.log(account._id, "i am zee account id")
        await db.User.findByIdAndUpdate(
            { '_id' : account._id},
          { 'userData.sessionToken': token },
          {'userFindAndModify' : false},
          { new: true }    //Set new option to true to return the document AFTER update was applied.
        )
        .then(res.json(token))
      }if(password !== passwordFromDb){
        return res.json("wrong password")
      }else{
        return res.json("wrong username")
      }
  })






router.post('/createAccount/:id1' , async (req, res) => {
  // console.log(req.body, "request body for auth")
  // let account = await db.User.findOne({"userData.userName" : req.body.userName})
  // .catch((error) => {
  //   res.send(error)
  // })
  // if(!account){
  //   const creds = saltHash(await req.body.password);
  //   const token = createSessiontoken();
  //   console.log(req, "request .......... noffin")
  //   const createUser = await req.body
  //   console.log(createUser , "const for the request body in the page for sure")
  //   // console.log(req.body , "request .......... boday")
  //   req.body.password = await creds.password;
  //   req.body.salt = await creds.salt;
  //   req.body.sessionToken = token;
  //   await db.User.create(createUser)
  //   .then(result => console.log(result))
  //   .then(result => res.send(result))
  //   .catch((error) => console.log(error))
  // }else{
  //   res.json("Username is already taken")
  // }
  console.log("create-func", req.body)
  console.log("userObj", req.body)
  const account = await db.User.findOne({ 'userData.userName': req.body.userName });
  console.log("account", account)
  if (!account) {
    const creds = saltHash(req.body.password);
    const token = createSessiontoken();
    req.body.password = creds.password;
    req.body.salt = creds.salt;
    req.body.sessionToken = token;
    await db.User.create(req.body)
      .then(result => res.json(result))
      .then(result => console.log(result))
      .catch(err => res.status(422).json(err));
  } else {
    res.json("User name already taken.")
  }
})

module.exports = router;