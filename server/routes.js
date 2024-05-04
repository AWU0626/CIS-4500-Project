const mysql = require('mysql')
const config = require('./config.json')
const axios = require('axios')

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
  const page = req.query.page ?? 1
  const query = `
select e1.ID as ID, e1.STATE as STATE, e1.AREA_NAME as AREA_NAME, e1.TIME as TIME, e1.COUNT as hs_below, e2.COUNT as hs, e3.COUNT as 4_below, e4.COUNT as 4_above
from EDUCATION e1 join EDUCATION e2 join EDUCATION e3 join EDUCATION e4 on e1.STATE = e2.STATE and e2.STATE = e3.STATE and e3.STATE = e4.STATE and e1.AREA_NAME = e2.AREA_NAME and e2.AREA_NAME = e3.AREA_NAME and e3.AREA_NAME = e4.AREA_NAME and e1.TIME = e2.TIME and e2.TIME = e3.TIME and e3.TIME = e4.TIME and e1.EDUCATION_LEVEL='hs_below' and e2.EDUCATION_LEVEL='hs' and e3.EDUCATION_LEVEL='4_below' and e4.EDUCATION_LEVEL='4_above'
order by e1.STATE, e1.AREA_NAME, e1.TIME`
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
  const state = req.params.state
  const county = req.params.county

  const query = `with specific_area as
                        (select *
                         from EDUCATION
                         where EDUCATION.STATE = '${state}' and EDUCATION.AREA_NAME = '${county}')
                 select e1.ID as ID, e1.STATE as STATE, e1.AREA_NAME as AREA_NAME, e1.TIME as TIME, e1.COUNT as hs_below, e2.COUNT as hs, e3.COUNT as 4_below, e4.COUNT as 4_above
                 from specific_area e1 join specific_area e2 join specific_area e3 join specific_area e4 on e1.STATE = e2.STATE and e2.STATE = e3.STATE and e3.STATE = e4.STATE and e1.AREA_NAME = e2.AREA_NAME and e2.AREA_NAME = e3.AREA_NAME and e3.AREA_NAME = e4.AREA_NAME and e1.TIME = e2.TIME and e2.TIME = e3.TIME and e3.TIME = e4.TIME and e1.EDUCATION_LEVEL='hs_below' and e2.EDUCATION_LEVEL='hs' and e3.EDUCATION_LEVEL='4_below' and e4.EDUCATION_LEVEL='4_above'
                 order by e1.TIME, e1.STATE, e1.AREA_NAME;`

  connection.query(query,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err)
        res.json([])
      } else {
        res.json(data)
      }
    })
}

// Route 3: GET /query3
const query3 = async function (req, res) {
  const priceMin = req.query.price_min ? req.query.price_min : 10000
  const priceMax = req.query.price_max ? req.query.price_max : 600000
  const page = req.query.page ?? 1
  const pageSize = req.query.page_size ?? 10
  const offset = (page - 1) * pageSize

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
   LIMIT ${pageSize} OFFSET ${offset};`

  connection.query(query,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err)
        res.json([])
      } else {
        res.json(data)
      }
    })
}

// Route 4: GET /query4
const query4 = async function (req, res) {
  const state = req.query.state
  const city = req.query.city
  const startGrade = req.query.start_grade ? req.query.start_grade : 1
  const endGrade = req.query.end_grade ? req.query.end_grade : 12
  const query = `SELECT school_id, state, city, start_grade, county, zip, address, name, start_grade, end_grade, enrollment,
     round(enrollment / ft_teacher, 1) AS student_teacher_ratio
FROM SCHOOL
WHERE state = '${state}' AND city = '${city}' AND start_grade >= ${startGrade} AND end_grade <= ${endGrade}
ORDER BY student_teacher_ratio ASC
limit 10;`
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err)
      res.status(500).json({ error: 'Failed to query database' })
    } else {
      res.status(200).json(data)
    }
  })
}

// Route 5: GET /query5
const query5 = async function (req, res) {
  const numStudent = req.query.num_student ? req.query.num_student : 20
  const numFaculty = req.query.num_faculty ? req.query.num_faculty : 1
  const startGrade = req.query.start_grade ? req.query.start_grade : 0
  const endGrade = req.query.end_grade ? req.query.end_grade : 8

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
ORDER BY CITY_AVG_RATIO, STATE_AVG_RATIO, AVG_HIGH_SCHOOL_GRAD_GROWTH DESC;`

  connection.query(query,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err)
        res.json([])
      } else {
        res.json(data)
      }
    })
}

// Route 6: GET /query6
const query6 = async function (req, res) {
  const minStartGrade = req.query.min_start_grade ?? 0
  const maxEndGrade = req.query.max_end_grade ?? 12
  const minEnrollment = req.query.min_enrollment ?? 0
  const numChildren = req.query.num_children ?? 1

  // pages
  const sqlQuery = `
    SELECT *
    FROM (
      SELECT fs.SCHOOL_ID, fs.NAME, fs.STATE, fs.CITY, fs.COUNTY, fs.ADDRESS,
              fs.START_GRADE, fs.END_GRADE, fs.ENROLLMENT,
              eh.hs_below, eh.4_below, eh.hs, eh.4_above,
              hd.avg_price, hd.avg_house_size, hd.avg_bed, hd.avg_bath,
              ROW_NUMBER() OVER(PARTITION BY fs.STATE
                  ORDER BY (
                        eh.4_above - eh.4_below) DESC,
                        hd.avg_price ASC,
                        hd.avg_house_size DESC,
                        hd.avg_bed DESC,
                        hd.avg_bath DESC
                  ) as rn
      FROM (
          SELECT s.SCHOOL_ID, s.NAME, s.STATE, s.CITY, s.COUNTY, s.ADDRESS,
          s.START_GRADE, s.END_GRADE, s.ENROLLMENT
          FROM SCHOOL s
          WHERE
          s.START_GRADE >= ${minStartGrade} AND
          s.END_GRADE <=  ${maxEndGrade} AND
          s.ENROLLMENT >= ${minEnrollment}
      ) as fs
          JOIN education_history_perYear eh ON fs.STATE = eh.STATE AND eh.AREA_NAME = fs.COUNTY
          JOIN housing_data_averages hd ON fs.STATE = hd.STATE AND fs.CITY = hd.CITY
      WHERE
          (eh.4_above - eh.4_below) > 0 AND
          hd.avg_bed >= (${numChildren} / 2)
    ) t
    WHERE rn <= 3
    ORDER BY
      (4_above - 4_below) DESC,
      avg_price ASC,
      avg_house_size DESC,
      avg_bed DESC,
      avg_bath DESC;`

  connection.query(sqlQuery, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.json([])
    } else {
      res.json(data)
    }
  })
}

// Route 7: GET /api/areas/zips/recommended/
const query7 = async function (req, res) {
  const page = req.query.page
  const pageSize = req.query.page_size ?? 10
  const offset = (page - 1) * pageSize

  const state = req.params.state
  const price_min = req.query.price_min ?? 50000
  const price_max = req.query.price_max ?? 1000000
  const beds_min = req.query.beds_min ?? 1
  const baths_min = req.query.baths_min ?? 1
  const enrollment_min = req.query.enrollment_min ?? 800
  const teachers_min = req.query.teachers_min ?? 20
  const start_grade = req.query.start_grade ?? 1

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
  `

  connection.query(query, [state, price_min, price_max, beds_min, baths_min, enrollment_min,
    teachers_min, start_grade, pageSize, offset], (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.status(500).json({ error: 'An error occurred while processing this request' })
    } else {
      res.json(data)
    }
  })
}

// Route 8: GET /query8
const query8 = async function (req, res) {
  const price_min = req.query.price_min ?? 100000
  const price_max = req.query.price_max ?? 600000
  const P = req.query.P
  const S = req.query.S

  let spacePerPerson
  if (S === 'small') {
    spacePerPerson = 150
  } else if (S === 'medium') {
    spacePerPerson = 250
  } else if (S === 'large') {
    spacePerPerson = 450
  } else {
    return res.status(400).json({ error: 'Invalid value for S. It should be either "small", "medium", or "large".' })
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
  `

  connection.query(query, [P, spacePerPerson, P, spacePerPerson], (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.status(500).json({ error: 'An error occurred while processing this request' })
    } else {
      res.json(data)
    }
  })
}

// Route 9: GET /query9
const query9 = async function (req, res) {
  const minPrice = req.query.min_price ? req.query.min_price : 0
  const maxPrice = req.query.max_price ? req.query.max_price : 1000000000
  const minBaths = req.query.min_baths ? req.query.min_baths : 0
  const minBeds = req.query.min_beds ? req.query.min_beds : 0
  const state = req.query.state
  const page = req.query.page ?? 1
  const query = `select *
from REAL_ESTATE
where PRICE between ${minPrice} AND ${maxPrice}
AND STATE = '${state}'
AND BED >= ${minBeds}
AND BATH >= ${minBaths}
ORDER BY PRICE
LIMIT 10 OFFSET ${(page - 1) * 10};`
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err)
      res.status(500).json({ error: 'Failed to query database' })
    } else {
      res.status(200).json(data)
    }
  })
}

// Route 10: GET /query10
const query10 = async function (req, res) {
  const state = req.query.state
  const minPrice = req.query.min_price ? req.query.min_price : 0
  const maxPrice = req.query.max_price ? req.query.max_price : 1000000000
  const page = req.query.page ?? 1
  const query = `select ZIP_CODE, AVG(PRICE) AS AVG_PRICE
from REAL_ESTATE
WHERE STATE = '${state}'
GROUP BY ZIP_CODE
HAVING AVG(PRICE) BETWEEN ${minPrice} AND ${maxPrice}
ORDER BY AVG_PRICE
LIMIT 10 OFFSET ${(page - 1) * 10};`
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err)
      res.status(500).json({ error: 'Failed to query database' })
    } else {
      res.status(200).json(data)
    }
  })
}

// Route 11: GET /place_search
const place_search = async function (req, res) {
  const address = req.query.address
  const apiKey = req.query.apikey
  const params = {
    textQuery: address
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.name'
  }

  try {
    const response = await axios.post('https://places.googleapis.com/v1/places:searchText', params, { headers })
    console.log(response.data)
    const placeName = response.data.places[0].name
    console.log(placeName)

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,photos'
      }
    }
    const getPlace = await axios.get(`https://places.googleapis.com/v1/${placeName}`, config)
    console.log(getPlace.data)

    if (getPlace.data.photos) {
      const photoInfo = getPlace.data.photos[0].name
      console.log(photoInfo)
      const getPhoto = await axios.get(`https://places.googleapis.com/v1/${photoInfo}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`, { responseType: 'arraybuffer' })
      res.setHeader('Content-Type', 'image/jpeg')
      res.send(getPhoto.data)
    } else {
      res.json({ error: 'No Photo Found' })
    }
  } catch (error) {
    console.log(error)
  }
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
  query10,
  place_search
}
