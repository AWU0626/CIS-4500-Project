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
  res.status(200).json({ message: 'query 3!' })
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

// Route 7: GET /query7
// Route 7: GET /api/areas/zips/recommended/
const query7 = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  const offset = (page - 1) * pageSize;

  const state = req.params.state;
  const price_min = req.query.price_min ?? 50000;
  const price_max = req.query.price_max ?? 1000000;
  const beds_min = req.query.beds_min ?? 1;
  const baths_min = req.query.baths_min ?? 1;
  const enrollment_min = req.query.enrollment_min ?? 800;
  const teachers_min = req.query.teachers_min ?? 20;
  const start_grade = req.query.start_grade ?? 1;

  const query = `
    SELECT r.CITY, r.ZIP_CODE,
      AVG(r.PRICE) as AVG_PRICE, AVG(r.BED) as AVG_BED,
      AVG(r.BATH) as AVG_BATH, COUNT(DISTINCT r.HOUSE_ID) as TOTAL_HOUSES,
      COUNT(DISTINCT s.SCHOOL_ID) as TOTAL_SCHOOLS, AVG(st.STUDENT_TEACHER_RATIO) as AVG_STUDENT_TEACHER_RATIO
    FROM (
      SELECT *
      FROM REAL_ESTATE
      WHERE STATE = ?
      AND PRICE BETWEEN ? AND ?
      AND BED >= ?
      AND BATH >= ?
    ) r
    JOIN (
      SELECT *
      FROM SCHOOL
      WHERE ENROLLMENT >= ?
      AND FT_TEACHER >= ?
      AND START_GRADE >= ?
    ) s ON r.STATE = s.STATE AND r.CITY = s.CITY AND r.ZIP_CODE = s.ZIP
    JOIN (
      SELECT SCHOOL_ID, ENROLLMENT/FT_TEACHER as STUDENT_TEACHER_RATIO
      FROM SCHOOL
    ) st ON s.SCHOOL_ID = st.SCHOOL_ID
    GROUP BY r.CITY, r.ZIP_CODE
    HAVING COUNT(DISTINCT r.HOUSE_ID) > 0 AND COUNT(DISTINCT s.SCHOOL_ID) > 0
    ORDER BY TOTAL_HOUSES DESC,
            TOTAL_SCHOOLS DESC,
            AVG_PRICE ASC,
            AVG_BED DESC,
            AVG_BATH DESC,
            AVG_STUDENT_TEACHER_RATIO ASC
    LIMIT ${pageSize} OFFSET ${offset};
  `;

  connection.query(query, [state, price_min, price_max, beds_min, baths_min, enrollment_min, 
    teachers_min, start_grade, pageSize, offset], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while processing this request' });
    } else {
      res.json(data);
    }
  });
}

// Route 8: GET /query8
const query8 = async function(req, res) {
  const price_min = req.query.price_min ?? 100000;
  const price_max = req.query.price_max ?? 600000;
  const P = req.query.P;
  const S = req.query.S;

  let spacePerPerson;
  if (S === 'small') {
    spacePerPerson = 150;
  } else if (S === 'medium') {
    spacePerPerson = 250;
  } else if (S === 'large') {
    spacePerPerson = 450;
  } else {
    return res.status(400).json({ error: 'Invalid value for S. It should be either "small", "medium", or "large".' });
  }

  const query = `
  WITH query3 AS (
    WITH se2021 AS (
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
 WHERE h.price <= ${price_max} AND h.price > ${price_min}
 )
 SELECT *
 FROM house_edu_filtered hef
 ORDER BY hef.price ASC
 ), 
 
 SPACE_MAX AS (
      SELECT
        CITY, ZIP_CODE,
        MAX(HOUSE_SIZE / (BED + BATH)) AS MAX_SE,
        MAX((BED + BATH) / (2 * 4)) as MAX_BBA,
        MAX(HOUSE_SIZE / (? * ?)) as MAX_SA
      FROM
        query3
    ), SCORE_CALC AS (
      SELECT
        HOUSE_ID,
        rt.STATE,
        rt.CITY,
        rt.ZIP_CODE,
        rt.PRICE,
        LEAST(BED, BATH) / GREATEST(BED, BATH) AS BBR,
        (HOUSE_SIZE / (BED + BATH)) / MAX_SE AS SE,
        ((BED + BATH) / (2 * 4)) / MAX_BBA AS BBA,
        (HOUSE_SIZE / (? * ?)) / MAX_SA AS SA
      FROM
        query3 as rt,
        SPACE_MAX
    ), FINAL_SCORE AS (
      SELECT
        HOUSE_ID, STATE, CITY, ZIP_CODE, PRICE,
        BBR, SE, BBA, SA,
        (BBR + SE + BBA + SA) / 4 AS SCORE
      FROM
        SCORE_CALC
    )
    SELECT
      fs.HOUSE_ID, STATE, CITY, ZIP_CODE, PRICE,
      ROUND(AVG(SCORE), 2) AS AVG_SCORE
    FROM FINAL_SCORE as fs
    GROUP BY fs.HOUSE_ID, STATE, CITY, ZIP_CODE, PRICE
    ORDER BY AVG_SCORE DESC
    LIMIT 20;
  `;

  connection.query(query, [P, spacePerPerson, P, spacePerPerson], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while processing this request' });
    } else {
      res.json(data);
    }
  });
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
