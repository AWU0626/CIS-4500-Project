import { useEffect, useState } from "react";
import axios from 'axios';
import { Card, CardActionArea, CardContent, Typography, Button, Container, Grid, Link, Slider, TextField } from '@mui/material';
import CountyStateCard from '../components/CountyStateCard';

const config = require('../config.json');

export default function SchoolToCityPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1); // 1 indexed
  const [pageSize, setPageSize] = useState(10);
  const [gradeRange, setGradeRange] = useState([0, 12]);
  const [numStudent, setNumStudent] = useState(20);
  const [numFaculty, setnumFaculty] = useState(1);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const arr = ['hello', 'world'];
  const columns = [
    {
      field: 'STATE_COUNTY', headerName: 'State And County', width: 200, renderCell: (params) => (
        <Link onClick={() => {
          const s = params.row.STATE_COUNTY.split(' ');
          setSelectedState(s[0]);
          setSelectedCounty(s[1]);
        }}>{params.value}</Link>
      )
    },
    // { field: 'COUNTY', headerName: 'County' },
    { field: 'CITY', headerName: 'City', width: 200 },
    { field: 'CITY_AVG_RATIO', headerName: 'City Average Student to Faculty Ratio', width: 200 },
    { field: 'STATE_AVG_RATIO', headerName: 'State Average Student to Faculty Ratio', width: 200 },
    { field: 'AVG_HIGH_SCHOOL_GRAD_GROWTH', headerName: 'Average Highschool Graduation Growth', width: 200 },
  ]

  // gets results from query5  
  const fetchQuery5 = async () => {
    try {
      const response = await axios.get(`http://${config.server_host}:${config.server_port}/api/areas/cities/recommended/?num_student=${numStudent}&num_faculty=${numFaculty}&start_grade=${gradeRange[0]}&end_grade=${gradeRange[1]}&page=${page}&page_size=${pageSize}`);

      const data = response.data.map((row, index) => {
        const { STATE, COUNTY, ...rest } = row;
        return { id: index, STATE_COUNTY: `${row.STATE}, ${row.COUNTY}`, ...rest };
      });

      console.log(data);
      setData(data)
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (STATE_COUNTY) => {
    // Handle the click event, e.g., navigate to a different page or show more details
    const s = STATE_COUNTY.split(/,/);
    setSelectedState(s[0].trim());
    setSelectedCounty(s[1].trim());
    console.log(`Clicked on card with state-county: ${STATE_COUNTY}`);
  };

  return (
    <Container  >
      {selectedState && selectedCounty && <CountyStateCard state={selectedState} county={selectedCounty} handleClose={() => { setSelectedCounty(null); setSelectedState(null) }} />}
      <h2 align='center'>Find Cities</h2>
      <Grid container spacing={4} alignItems='center' justifyContent='center' style={{ marginBottom: '16px' }}>
        <Grid item xs={2} sm={2} md={2}>
          <TextField label='number of students' value={numStudent} onChange={(e) => {
            const num = e.target.value;
            if (!isNaN(num)) {
              setNumStudent(parseInt(num));
            } else {
              setNumStudent(numStudent); // if types NaN then set it to what it is already
            }
          }} style={{ width: "100%" }} />
        </Grid>
        <Grid item xs={2} md={2} >
          <TextField label='number of faculty' value={numFaculty} onChange={(e) => {
            const num = e.target.value;
            if (!isNaN(num)) {
              setnumFaculty(parseInt(num));
            } else {
              setnumFaculty(numFaculty);  // if types NaN then set it to what it is already
            }
          }} style={{ width: "100%" }} />
        </Grid>
      </Grid>
      <Grid item xs={3} >
        <div align='center'>Range of Grade</div>
        <div style={{ maxWidth: '350px', margin: '0 auto' }}> {/* Adjust width as needed */}
          <Slider
            value={gradeRange}
            min={0}
            max={12}
            step={1}
            onChange={(e, newValue) => setGradeRange(newValue)}
            valueLabelDisplay='auto'
          />
        </div>
      </Grid>
      <Grid item>
        <Button fullWidth onClick={() => fetchQuery5()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Search
        </Button>
      </Grid>
      <h2 align='center'>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <Grid container spacing={2}>
        {data && data.map(row => {
          return <Grid item key={row.id} xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 500 }}>
              <CardActionArea>
                {/* <CardMedia
            component="img"
            height="140"
            image="/static/images/cards/contemplative-reptile.jpg"
            alt="green iguana"
          /> */}
                <CardContent>
                  <Button onClick={() => handleClick(row.STATE_COUNTY)} fullWidth>
                    <Typography gutterBottom variant='h4' component='div' >
                      {row.STATE_COUNTY}
                    </Typography>
                  </Button>
                  <Typography gutterBottom variant='h7' align='center' component='div' color="text.secondary">
                    {row.CITY}
                  </Typography>
                  <Typography variant='subtitle' align='left' component='div'>Ratio in city: {row.CITY_AVG_RATIO}</Typography>
                  <Typography variant='subtitle' align='left' component='div'>Ratio in state: {row.STATE_AVG_RATIO}</Typography>
                  <Typography variant='subtitle' align='left' component='div'>Average Graduation Growth: {row.AVG_HIGH_SCHOOL_GRAD_GROWTH}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        })}
      </Grid>
    </Container>
  );
}