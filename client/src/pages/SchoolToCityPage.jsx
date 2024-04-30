import { useEffect, useState } from "react";
import axios from 'axios';
import { Card, CardMedia, CardActionArea, CardContent, Typography, Button, Container, Grid, Link, Slider, TextField } from '@mui/material';
import CountyStateCard from '../components/CountyStateCard';
import PageNavigator from '../components/PageNavigator';
import NotAvail from '../images/PhotoNotAvailable.png'
const config = require('../config.json');
const configMap = require('../configMap.json');

export default function SchoolToCityPage() {
  const [data, setData] = useState([]);
  const [gradeRange, setGradeRange] = useState([0, 12]);
  const [numStudent, setNumStudent] = useState(20);
  const [numFaculty, setnumFaculty] = useState(1);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 1 indexed
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9; // limit to 9 because google maps api is expensive

  // gets results from query5  
  const fetchQuery5 = async (currPage) => {
    try {
      const response = await axios.get(`http://${config.server_host}:${config.server_port}/api/areas/cities/recommended/?num_student=${numStudent}&num_faculty=${numFaculty}&start_grade=${gradeRange[0]}&end_grade=${gradeRange[1]}`);
      const offset = (currPage - 1) * pageSize;
      const slicedData = response.data.slice(offset, offset + pageSize);
      const numResults = response.data.length;
      setTotalPages(Math.ceil(numResults/pageSize));
      
      console.log('currentPage: ' + currPage);
      console.log('offset: ' + offset);
      console.log('total pages: ' + Math.ceil(numResults/pageSize));
      console.log(slicedData);

      const data = slicedData.map((row, index) => {
        const { STATE, COUNTY, ...rest } = row;
        return { id: index, STATE_COUNTY: `${row.STATE}, ${row.COUNTY}`, ...rest };
      });

      console.log(data);

      if (configMap.apikey.length !== 0) {
        const allphotos = await Promise.all(data.map(async (row, index) => {
          const photo = await axios.get(`http://${config.server_host}:${config.server_port}/api/place_search/?address=${row.STATE_COUNTY},${row.CITY}&apikey=${configMap.apikey}`, { responseType: 'blob' });
          if (photo.data.type === 'image/jpeg') {
            console.log(photo.data);
            const imageUrl = URL.createObjectURL(photo.data);
            return imageUrl;
          } else {
            return '';
          }
        }));
        setImages(allphotos);
      } else {
        const emptyPhotos = [];
        for (let i = 0; i < pageSize; i++) {
          emptyPhotos.push('');
        }
        setImages(emptyPhotos);
      }
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

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await fetchQuery5(pageNumber);
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
              setNumStudent(num === '' ? '' : parseInt(num));
            } else {
              setNumStudent(numStudent); // if types NaN then set it to what it is already
            }
          }} style={{ width: "100%" }} />
        </Grid>
        <Grid item xs={2} md={2} >
          <TextField label='number of faculty' value={numFaculty} onChange={(e) => {
            const num = e.target.value;
            if (!isNaN(num)) {
              setnumFaculty(num === '' ? '' : parseInt(num));
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
        <Button fullWidth onClick={() => fetchQuery5(currentPage)} style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Search
        </Button>
      </Grid>
      <h2 align='center'>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <Grid container spacing={2}>
        {data && data.map((row, index) => {
          return <Grid item key={row.id} xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 500 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="300"
                  image={images[index].length != 0 ? images[index] : NotAvail}
                  alt={`city photo ${index}`}
                />
                <CardContent>
                  <Button onClick={() => handleClick(row.STATE_COUNTY)} fullWidth style={{ textAlign: 'left', fontSize: '2em', margin: '0' }}>
                    {row.STATE_COUNTY}
                  </Button>
                  <Typography gutterBottom variant='h7' align='center' component='div' color="text.secondary">
                    {row.CITY}
                  </Typography>
                  <Typography variant='subtitle' align='left' component='div'>Student to Faculty Ratio:</Typography>
                  <Typography variant='subtitle' align='left' component='div'>Ratio in city: {row.CITY_AVG_RATIO}</Typography>
                  <Typography variant='subtitle' align='left' component='div'>Ratio in state: {row.STATE_AVG_RATIO}</Typography>
                  <Typography variant='subtitle' align='left' component='div'>Average Graduation Growth: {row.AVG_HIGH_SCHOOL_GRAD_GROWTH}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        })}
      </Grid>
      <div align='center'>
        <PageNavigator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Container>
  );
}