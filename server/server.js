const express = require('express')
const cors = require('cors')
const config = require('./config')
const routes = require('./routes')

const app = express()
app.use(cors({
  origin: '*'
}))

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/api/', routes.mainpage)
app.get('/api/areas/cities/education/', routes.query1And2)
app.get('/api/education/:state/:county/', routes.query2)
app.get('/api/houses/growing/', routes.query3)
app.get('/api/schools/ratio/', routes.query4)
app.get('/api/areas/cities/recommended/', routes.query5)
app.get('/api/schools/recommended/', routes.query6)
app.get('/api/areas/zips/recommended/', routes.query7)
app.get('/api/areas/zips/occupancy/', routes.query8)
app.get('/api/houses/', routes.query9)
app.get('/api/areas/zips/prices/', routes.query10)
app.get('/api/place_search/', routes.place_search)

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
})

module.exports = app
