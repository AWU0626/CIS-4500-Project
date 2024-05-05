import { useEffect, useState } from "react";
import axios from 'axios';
import { Divider, Container, Grid, Link, Slider, TextField, Typography } from '@mui/material';
import { LineChart, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Line, Tooltip, CartesianGrid, Legend, PolarRadiusAxis } from 'recharts';
import PageNavigator from '../components/PageNavigator';
import MainImage from '../images/ScholarStreetT1.png';

const config = require('../config.json');

export default function HomePage() {

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 1 indexed
  const [totalPages, setTotalPages] = useState(0);
  const [allData, setAllData] = useState([]);
  const pageSize = 36; // limit to 9 because google maps api is expensiv

  const fetchQuery1 = async (currPage) => {
    try {
      const response = await axios.get(`http://${config.server_host}:${config.server_port}/api/areas/cities/education/`);
      const data = response.data;
      setAllData(data);
      setCurrentPage(1);
    } catch (error) {
      console.log('error fetching query1');
    }
  }

  const cleanData = (currPage) => {
    const offset = (currPage - 1) * pageSize;
    const slicedData = allData.slice(offset, offset + pageSize);
    const numResults = allData.length;

    console.log('currentPage: ' + currPage);
    console.log('offset: ' + offset);
    console.log('total pages: ' + Math.ceil(numResults / pageSize));
    console.log(slicedData);

    setTotalPages(Math.ceil(numResults / pageSize));
    console.log(slicedData);

    const arr = []; // stores each state-county timeline per slot
    for (let i = 0; i < slicedData.length; i += 6) {
      const state_county = `${slicedData[i].STATE}, ${slicedData[i].AREA_NAME}`;
      const json = {};
      json[state_county] = [];
      for (let j = i; j < i + 6; j++) { // store timeline in dat
        const dat = {
          time: slicedData[j].time,
          hs_below: slicedData[j].hs_below,
          hs: slicedData[j].hs,
          below_4: slicedData[j]['4_below'],
          above_4: slicedData[j]['4_above']
        };
        json[state_county].push(dat);
      }
      arr.push(json);
    }
    setData(arr);
  }

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    cleanData(currentPage);
  }, [currentPage])

  useEffect(() => {
    fetchQuery1(1);
  }, []);

  return (
    <Container>
      <Typography variant="h3" marginTop={3} >Welcome to ScholarStreets!</Typography>
      <Grid container item spacing={2} style={{ marginTop: "1rem", marginBottom: "2rem" }}>
        <Grid item xs={6}>
          <Typography variant="p">Our mission is to provide users accurate data about real estate,
            schools and education history data for various locations in the United States. Our website is composed
            of four main features:
          </Typography>
          <Typography variant="h6" style={{ fontWeight: "bold", marginTop: 2, marginBottom: 2 }}>
            Zipcode Search
            <Typography style={{ marginTop: 2, marginBottom: 5 }}>
            Explore Zip codes that match your criteria effortlessly. Select your state and refine your search by amenities, features, and school information including enrollment, teacher count, and grade levels. Discover the best places to live with ease.
            </Typography>
          </Typography>
          <Typography variant="h6" style={{ fontWeight: "bold", marginTop: 2, marginBottom: 2 }}>
            Education Cities
            <Typography variant="body1" style={{ marginTop: 2, marginBottom: 5 }}>
            Navigate the maze of educational choices effortlessly with our specialized tab designed for parents who prioritize their child's education above all else. Unsure of where to live but deeply invested in securing the best education for your child in America? Look no further. Simply input your desired grade range, along with the number of students to number of faculty you envision for your child's learning environment. Let our platform guide you towards neighborhoods and communities renowned for their educational excellence, ensuring your child receives the quality education they deserve.
            </Typography>
          </Typography>
          <Typography variant="h6" style={{ fontWeight: "bold", marginTop: 2, marginBottom: 2 }}>
            Search Rank
            <Typography style={{ marginTop: 2, marginBottom: 5 }}>
            Embark on your quest for the perfect home with our innovative double search feature. 
            Begin by exploring houses in the top 20 states boasting the fastest growth in higher 
            education over the past decade. Then, refine your search further by entering your preferred 
            price range and considering factors like the number of occupants and average space per person.
             Powered by a smart ranking system, our platform utilizes advanced mathematics to prioritize listings,
              ensuring you find a home that perfectly aligns with your unique needs and preferences.
            </Typography>
          </Typography>
          <Typography variant="h6" style={{ fontWeight: "bold", marginTop: 2, marginBottom: 2 }}>
            School Search
            <Typography style={{ marginTop: 2, marginBottom: 5 }}>
              Discover schools based on grade levels and enrollment numbers.
              Get insights into the surrounding areas with basic statistics.
              Interested in a particular school? Explore nearby housing options and
              compare average prices across different zip codes.
            </Typography>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          {/* Figurine Image & Description */}
          <figure>
            <img src={MainImage}
              alt="DallE School Main"
              style={{
                maxWidth: '400px', height: 'auto'
              }} />

            <figcaption style={{
              textAlign: 'left', fontSize: "8px", marginTop: "-8px"
            }}>
              Image generated by Dall-E
            </figcaption>
          </figure>
        </Grid>
      </Grid>


      <hr style={{ marginTop: "2rem", marginBottom: "1rem" }} />
      <Typography variant="h5" style={{ fontWeight: "bold", marginTop: 3, marginBottom: 10 }} >Education History per state and county</Typography>
      <Typography style={{ marginTop: 2, marginBottom: 5 }}>
        Before you start, check out some of the education history for each state, county below!
      </Typography>

      <Grid container item style={{ marginTop: "1rem", marginBottom: "2rem" }}>
        <Grid item xs={6}>
          <Typography variant="h6" style={{ fontWeight: "bold", marginTop: 2, marginBottom: 2 }}>
            hs_below
            <Typography variant="body1" style={{ marginTop: 2, marginBottom: 5 }}>
              the number of people at the time with less than a high school degree
            </Typography>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" style={{ fontWeight: "bold", marginTop: 2, marginBottom: 2 }}>
            hs
            <Typography variant="body1" style={{ marginTop: 2, marginBottom: 5 }}>
              the number of people at the time with a high school degree
            </Typography>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" style={{ fontWeight: "bold", marginTop: 2, marginBottom: 2 }}>
            below_4
            <Typography variant="body1" style={{ marginTop: 2, marginBottom: 5 }}>
              the number of people at the time with less than a bachelor's degree
            </Typography>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" style={{ fontWeight: "bold", marginTop: 2, marginBottom: 2 }}>
            above_4
            <Typography variant="body1" style={{ marginTop: 2, marginBottom: 5 }}>
              the number of people at the time with more than a bachelor's degree
            </Typography>
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {data && data.map((row, index) => {
          console.log(row)
          return <Grid item key={row.id} xs={12} sm={6} md={4}>
            <Typography variant="h5" align="center">{Object.keys(row)[0]}</Typography>
            <ResponsiveContainer height={250}>
              <LineChart width={730} height={250} data={row[Object.keys(row)[0]]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hs_below" stroke="#8884d8" />
                <Line type="monotone" dataKey="hs" stroke="#82ca9d" />
                <Line type="monotone" dataKey="below_4" stroke="#82c2ca" />
                <Line type="monotone" dataKey="above_4" stroke="#ca82c9" />
              </LineChart>
            </ResponsiveContainer>
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
};