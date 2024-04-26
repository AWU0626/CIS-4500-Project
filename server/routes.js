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
  const numStudent = req.query.num_student ? req.query.num_student : 20;
  const numFaculty = req.query.num_faculty ? req.query.num_faculty : 1; 
  const startGrade = req.query.start_grade ? req.query.start_grade : 0;
  const endGrade = req.query.end_grade ? req.query.end_grade : 8;
  const page = req.query.page ?? 1;
  const pageSize = req.query.page_size ?? 10;
  const offset = (page - 1) * pageSize;

  const query = `WITH RATIO_PER_SCHOOL AS (
    SELECT STATE, COUNTY, CITY, START_GRADE, END_GRADE, (ENROLLMENT / FT_TEACHER) AS ratio
    FROM SCHOOL
    WHERE FT_TEACHER <> 0 AND ENROLLMENT IS NOT NULL AND ENROLLMENT <> 0
 ),
 AVG_RATIO_STATE AS (
     SELECT STATE, AVG(ratio) AS STATE_AVG_RATIO
     FROM RATIO_PER_SCHOOL
     WHERE ratio <= (${numStudent} / ${numFaculty})
       AND START_GRADE >= (${startGrade}) AND  END_GRADE <= (${endGrade})
     GROUP BY STATE
 ),
 AVG_RATIO_CITYSTATE AS (
     SELECT COUNTY, CITY, AVG(ratio) AS CITY_AVG_RATIO, STATE, STATE_AVG_RATIO
     FROM RATIO_PER_SCHOOL NATURAL JOIN AVG_RATIO_STATE
     WHERE START_GRADE >= (${startGrade}) AND  END_GRADE <= (${endGrade})
     GROUP BY CITY, STATE
     ORDER BY CITY_AVG_RATIO, STATE_AVG_RATIO
 ),
 se2021 AS (
     SELECT state, area_name, count
     FROM EDUCATION
     WHERE time = 2021
       AND CASE
               WHEN (${startGrade}) >= 0 AND (${endGrade}) <= 8 THEN EDUCATION_level = 'hs'
               ELSE EDUCATION_level = '4_above'
         END
 ),
 se2012 AS (
     SELECT state, area_name, count
     FROM EDUCATION
     WHERE time = 2012
       AND CASE
               WHEN (${startGrade}) >= 0 AND (${endGrade}) <= 8 THEN EDUCATION_level = 'hs'
               ELSE EDUCATION_level = '4_above'
         END
 ),
 EDUCATION_filtered AS (
     SELECT s1.state, s1.area_name,
            round(((s1.count - s2.count) / s2.count), 2) AS AVG_HIGH_SCHOOL_GRAD_GROWTH
     FROM se2021 s1 JOIN se2012 s2 ON s1.state = s2.state AND s1.area_name = s2.area_name
     WHERE s1.count - s2.count > 0
     GROUP BY s1.state, s1.area_name
 )
SELECT round(CITY_AVG_RATIO, 2) AS CITY_AVG_RATIO,
   round(STATE_AVG_RATIO, 2) AS STATE_AVG_RATIO,
   round(AVG_HIGH_SCHOOL_GRAD_GROWTH, 2) AS AVG_HIGH_SCHOOL_GRAD_GROWTH,
   A.STATE, COUNTY, CITY
FROM AVG_RATIO_CITYSTATE A JOIN EDUCATION_filtered E ON A.COUNTY = E.AREA_NAME AND A.STATE = E.STATE
ORDER BY CITY_AVG_RATIO, STATE_AVG_RATIO, AVG_HIGH_SCHOOL_GRAD_GROWTH DESC
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
