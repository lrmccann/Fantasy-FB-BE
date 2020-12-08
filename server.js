require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT ;
const routes = require('./routes/routes');
const cors = require('cors');

console.log(process.env , "port for process env")


app.use(cors());
// solution for CORS policy issues
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",  "*");
    res.header("Access-Control-Allow-Headers", "Origin , Content-Type , Accept , Authorization , X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD');
    // res.header("Access-Control-Allow-Credentials", true);
    next();
  });


// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());


mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lrmccann:Allison401@cluster0.ev4mw.mongodb.net/FantasyUsers?retryWrites=true&w=majority' , { useNewUrlParser: false , useUnifiedTopology: false })
// mongodb://xyz456-shard-00-00.ab123.mongodb.net:27017

app.use('/routes' , routes);

// routes.route(app)

app.get('/' , function(req , res) {
    res.send("my api asfd")
})

app.get("/status" , function(req , res) {
    res.send("hello from football")
})

app.listen(PORT , function(){
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`)
})

// app.listen(
//     PORT,
//     () => console.log(`app is listening at http://localhost:${PORT}`)
// )
