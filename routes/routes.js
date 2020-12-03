const router = require("express").Router();
// const { response } = require("express");
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
      .findOne({ 'userData.userName': username } , function(err , docs){
        if(err){
          console.log(err , "i am first error")
          return res.json(err)
        }else{
          console.log(docs , "more docs to log i guess")
          return res.json("it worked")
        }
      })
      // .catch((error)=> {
      //   console.log(error)
      //   res.status('300').send('bad call')
      // })
      let passwordFromDb = account.password
      if(password === passwordFromDb){
        console.log("successfully logged in")
        const token = createSessiontoken()
        console.log(token , "this is session token")
        console.log(account._id, "i am zee account id")
        await db.User.findByIdAndUpdate(
            { '_id' :account._id},
          { 'userData.sessionToken': token },
          // { new: true },    //Set new option to true to return the document AFTER update was applied.
          function(err , docs){
            if(err){
              console.log(err , "i am second error")
              return res.json(err)
            }else{
              console.log(docs , "idk what this is but its docs")
              return res.json("it worked")
            }
          }
        )
        // .then((result) => console.log(result , "i am final result????"))
        // .then(result => res.json(result.userData))
        // .then(result => console.log(res.json(result) , "i am the result console logged"))
        // .catch((error) => {
        //   console.log(error)
        //   return error
        // })
      }if(password !== passwordFromDb){
        // res.json("Wrong password, please try again")
        return res.json("wrong password")
      }else{
        // res.json("Wrong username, please try again")
        return res.json("wrong username")
      }
    // console.log(account, "this is account")
    // let match = await account.password
    // if(password === match){
    //   console.log("password DID match")
    //   const token = createSessiontoken();
    //   console.log(token , "i am session token")
    //   await db.User.findOneAndUpdate(
    //     { 'userData.userName': username },
    //     { 'userData.sessionToken': token },
    //     { new: true },    //Set new option to true to return the document AFTER update was applied.
    //     {useFindAndModify : false}
    //   )
    //     .then(result => res.json(result.userData))
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // } if(!account){
    //   res.json("Incorrect username, try again")
    // }else{
    //   res.json("Incorrect password, try again")
    // }
  })

  // const checkPasswordAndSessionToken = async (account , password) => {
  //   console.log(account, "i am account in checkpasswordandsessiontoken")
  //   console.log(password , "i am password in checkpasswordandsessiontoken")
  //   let passwordFromDb = account.password
  //   if(password === passwordFromDb){
  //     console.log("successfully logged in")
  //     const token = createSessiontoken()
  //     console.log(token , "this is session token")
  //     console.log(account._id, "i am zee account id")
  //     await db.User.findByIdAndUpdate(
  //        account._id,
  //       { 'userData.sessionToken': token },
  //       // { new: true },    //Set new option to true to return the document AFTER update was applied.
  //       function(err , docs){
  //         if(err){
  //           console.log(err)
  //         }else{
  //           console.log(docs , "idk what this is but its docs")
  //         }
  //       }
  //     )
  //     .then(result => res.json(result))
  //     .then(result => console.log(res.json(result) , "i am the result console logged"))
  //     // .catch((error) => {
  //     //   console.log(error)
  //     //   return error
  //     // })
  //   }if(password !== passwordFromDb){
  //     res.json("Wrong password, please try again")
  //   }else{
  //     res.json("Wrong username, please try again")
  //   }
  // }

// })

module.exports = router;