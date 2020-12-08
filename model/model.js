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
        // date: {type : Date , default : Date.now}
    }
});

const User = mongoose.model("users" , userSchema);

// tried FantasyUsers

module.exports = User;