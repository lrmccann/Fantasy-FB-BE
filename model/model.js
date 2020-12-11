const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    password : String,
    salt : String,
    userData : {
        sessionToken : String,
        userName : String,
        teamName : String,
        email : String,
        city : String,
        zipCode : String,
        age : Number,
        favoriteTeam : String,
        additionalInfo : String,
        winLossRation : String
        // date: {type : Date , default : Date.now}
    },
    userFantasyTeam : Array
});

const User = mongoose.model("users" , userSchema);

module.exports = User;