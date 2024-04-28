const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
})
connection.connect((err) => err && console.log(err))
console.log('Connected to MySQL database')
// Route: GET / - sends message to the main page
const mainpage = async function (req, res) {
  res.status(200).json({ message: 'Welcome to the Home Page' })
}

// Route 1: GET /query1
const query1 = async function (req, res) {
  res.status(200).json({ message: 'query 2!' })
}

// Route 2: GET /query2
const query2 = async function (req, res) {
  res.status(200).json({ message: 'query 1!' })
}

// Route 3: GET /query3
const query3 = async function (req, res) {
  res.status(200).json({ message: 'query 3!' })
}

// Route 4: GET /query4
const query4 = async function (req, res) {
  res.status(200).json({ message: 'query 4!' })
}

// Route 5: GET /query5
const query5 = async function (req, res) {
  res.status(200).json({ message: 'query 5!' })
}

// Route 6: GET /query6
const query6 = async function (req, res) {
  res.status(200).json({ message: 'query 6!' })
}

// Route 7: GET /query7
const query7 = async function (req, res) {
  res.status(200).json({ message: 'query 7!' })
}

// Route 8: GET /query8
const query8 = async function (req, res) {
  res.status(200).json({ message: 'query 8!' })
}

// Route 9: GET /query9
const query9 = async function (req, res) {
  res.status(200).json({ message: 'query 9!' })
}

// Route 10: GET /query10
const query10 = async function (req, res) {
  res.status(200).json({ message: 'query 10!' })
}

module.exports = {
  mainpage,
  query1,
  query2,
  query3,
  query4,
  query5,
  query6,
  query7,
  query8,
  query9,
  query10
}
