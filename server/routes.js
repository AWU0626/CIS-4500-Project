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
  res.status(200).json({ message: 'Welcome to the main page!' })
}

// Route 1: GET /query1
const query1 = async function (req, res) {
  const query = `
select e1.ID as ID, e1.STATE as STATE, e1.AREA_NAME as AREA_NAME, e1.TIME as TIME, e1.COUNT as hs_below, e2.COUNT as hs, e3.COUNT as 4_below, e4.COUNT as 4_above
from EDUCATION e1 join EDUCATION e2 join EDUCATION e3 join EDUCATION e4 on e1.STATE = e2.STATE and e2.STATE = e3.STATE and e3.STATE = e4.STATE and e1.AREA_NAME = e2.AREA_NAME and e2.AREA_NAME = e3.AREA_NAME and e3.AREA_NAME = e4.AREA_NAME and e1.TIME = e2.TIME and e2.TIME = e3.TIME and e3.TIME = e4.TIME and e1.EDUCATION_LEVEL='hs_below' and e2.EDUCATION_LEVEL='hs' and e3.EDUCATION_LEVEL='4_below' and e4.EDUCATION_LEVEL='4_above'
order by e1.TIME, e1.STATE, e1.AREA_NAME`
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err)
      res.status(500).json({ error: 'Failed to query database' })
    } else {
      res.status(200).json(data)
    }
  })
}

// Route 2: GET /query2
const query2 = async function (req, res) {
  const state = req.query.state
  const area = req.query.area
  const query = `
  with specific_area as
  (select *
   from EDUCATION
   where EDUCATION.STATE = '%${state}%' and EDUCATION.AREA_NAME = '%${area}%')
select e1.ID as ID, e1.STATE as STATE, e1.AREA_NAME as AREA_NAME, e1.TIME as TIME, e1.COUNT as hs_below, e2.COUNT as hs, e3.COUNT as 4_below, e4.COUNT as 4_above
from specific_area e1 join specific_area e2 join specific_area e3 join specific_area e4 on e1.STATE = e2.STATE and e2.STATE = e3.STATE and e3.STATE = e4.STATE and e1.AREA_NAME = e2.AREA_NAME and e2.AREA_NAME = e3.AREA_NAME and e3.AREA_NAME = e4.AREA_NAME and e1.TIME = e2.TIME and e2.TIME = e3.TIME and e3.TIME = e4.TIME and e1.EDUCATION_LEVEL='hs_below' and e2.EDUCATION_LEVEL='hs' and e3.EDUCATION_LEVEL='4_below' and e4.EDUCATION_LEVEL='4_above'
order by e1.TIME, e1.STATE, e1.AREA_NAME
  `
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err)
      res.status(500).json({ error: 'Failed to query database' })
    } else {
      res.status(200).json(data)
    }
  })
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
