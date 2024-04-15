const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
// const connection = mysql.createConnection({
//   host: config.rds_host,
//   user: config.rds_user,
//   password: config.rds_password,
//   port: config.rds_port,
//   database: config.rds_db
// });
// connection.connect((err) => err && console.log(err));

// Route 1: GET / - sends message to the main page
const mainpage = async function(req, res) {
  res.status(200).json({message: 'Welcome to the Home Page'});
}

// Route : GET /hello for testing
const hello = async function(req, res) {
  res.status(200).json({message: 'Hello World!'});
}
/* TODO either replace query const names or add Input/output description comments above query route*/

// Route 1: GET /query1
const query1 = async function(req, res) {
  res.status(200).json({message: 'query 1!'});
}

// Route 2: GET /query2
const query2 = async function(req, res) {
  res.status(200).json({message: 'query 2!'});
}

module.exports = {
  mainpage,
  hello,
  query1,
  query2
}
