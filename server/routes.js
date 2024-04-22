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
  const minStartGrade = req.params.min_start_grade ?? 0;
  const maxEndGrade = req.params.max_end_grade ?? 12;
  const minEnrollment = req.params.min_enrollment ?? 0;
  const numChildren = req.params.num_children ?? 1;

  // pages
  const page = req.params.page ?? 2;
  const pageSize = req.params.page_size ?? 10;

  if (!page) {
    const sqlQueryNoLimit = `
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
        avg_bath DESC;`;
    connection.query(sqlQueryNoLimit, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    const offset = (page - 1) * pageSize;

    const sqlQueryWithLimit = `
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
        avg_bath DESC
      LIMIT ${pageSize} OFFSET ${offset}`;
    connection.query(sqlQueryWithLimit, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
        console.log(res[0]);
      }
    });
  }
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
