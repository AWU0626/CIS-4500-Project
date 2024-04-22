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
const query1And2 = async function (req, res) {
  res.status(200).json({ message: 'query 1!' })
}

// Route 2: GET /query3
const query3 = async function (req, res) {
  const priceMin = req.query.price_min ? req.query.price_min : 10000;
  const priceMax = req.query.price_max ? req.query.price_max : 600000; 
  const page = req.query.page ?? 1;
  const pageSize = req.query.page_size ?? 10;
  const offset = (page - 1) * pageSize;

  const query = `WITH se2021 AS (
    SELECT e.ID, e.STATE, e.AREA_NAME, e.COUNT AS year21Count
    FROM EDUCATION e
    WHERE time = 2021
      AND education_level LIKE '4_above'
   ), se2012 AS (
    SELECT e.STATE, e.AREA_NAME, e.COUNT AS year12Count
    FROM EDUCATION e
    WHERE time = 2012
      AND education_level LIKE '4_above'
   ), edu_filtered AS (
      SELECT s21.STATE,
              round(((sum(year21Count) - SUM(year12Count)) / SUM(year12Count)), 2) AS avg_higher_edu_growth
      FROM se2021 s21
          JOIN se2012 s12 ON s12.AREA_NAME = s21.AREA_NAME
          AND s12.STATE = s21.STATE
   
   
      GROUP BY s21.state
      ORDER BY avg_higher_edu_growth DESC
      LIMIT 20
   ), house_edu_filtered AS (
    SELECT h.house_id, h.bed, h.bath, h.city, h.zip_code, h.house_size, h.price, ef.*
    FROM  REAL_ESTATE h
    JOIN edu_filtered ef ON ef.state = h.state
    WHERE h.price <= ${priceMax} AND h.price > ${priceMin}
   )
   SELECT *
   FROM house_edu_filtered hef
   ORDER BY hef.price ASC 
   LIMIT ${pageSize} OFFSET ${offset};`;

  connection.query(query, 
    (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 3: GET /query4
const query4 = async function (req, res) {
  res.status(200).json({ message: 'query 4!' })
}

// Route 4: GET /query5
const query5 = async function (req, res) {
  res.status(200).json({ message: 'query 5!' })
}

// Route 5: GET /query6
const query6 = async function (req, res) {
  res.status(200).json({ message: 'query 6!' })
}

// Route 6: GET /query7
const query7 = async function (req, res) {
  res.status(200).json({ message: 'query 7!' })
}

// Route 7: GET /query8
const query8 = async function (req, res) {
  res.status(200).json({ message: 'query 8!' })
}

// Route 8: GET /query9
const query9 = async function (req, res) {
  res.status(200).json({ message: 'query 9!' })
}

// Route 9: GET /query10
const query10 = async function (req, res) {
  res.status(200).json({ message: 'query 10!' })
}

module.exports = {
  mainpage,
  query1And2,
  query3,
  query4,
  query5,
  query6,
  query7,
  query8,
  query9,
  query10
}
