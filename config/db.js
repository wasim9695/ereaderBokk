require('dotenv').config()
var mongoose = require('mongoose');
const mongoUrl = "mongodb+srv://ereader:rakouGbef5ZOLstb@cluster0.jrvykrm.mongodb.net/?retryWrites=true&w=majority";
var db = mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.once('open', () => {
    console.log('connected to database');
});

mongoose.connection.once('error', (error) => {
    console.log(error);
});

console.log(mongoose.connection.readyState);
var onerror = function (error, callback) {
    mongoose.connection.close();
    callback(error);
};

const Users = require('../models/Users');

mongoose.Promise = global.Promise;
module.exports.db = db;
module.exports = {
    Users
}