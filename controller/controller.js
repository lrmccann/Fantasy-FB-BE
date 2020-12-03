const db = require("../model/index");
const express = require('express');
const { response } = require("express");


module.exports = {

    // findAll : async function (req , res) {
    //     await db.User
    //     .find({})
    //     .then(res => {
    //         let array = res.map(function(user){
    //             console.log("this is user" , user)
    //             return user.collection
                
    //         })
    //         console.log(array)
    //         res.map((key , index) => console.log(key , "keys from request"))
    //         console.log(index , "index from request ")
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     })
    // }

//     findAll : async function (req , res) {
//         await db.User
//         .find({})
//         .then(res => {
//             console.log(res , "i am whole response from controller")
//             let array = res.map(function(user) {
//                 console.log(user , "decom user")
//                 return user
//             })
//             console.log("array of stuff" , array);
//             return array
//         })
//         .catch((err) => {console.log(err)})
//     }
}