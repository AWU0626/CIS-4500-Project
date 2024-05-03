import { useEffect, useState } from "react";
import axios from 'axios';
import { Container, Grid, Link, Slider, TextField, Typography } from '@mui/material';
import { LineChart, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Line, Tooltip, CartesianGrid, Legend, PolarRadiusAxis } from 'recharts';
import PageNavigator from '../components/PageNavigator';

const config = require('../config.json');

export default function HomePage() {

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 1 indexed
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 36; // limit to 9 because google maps api is expensiv

  const fetchQuery1 = async (currPage) => {
    try {
      const response = await axios.get(`http://${config.server_host}:${config.server_port}/api/areas/cities/education/`);
      const data = response.data;
      const offset = (currPage - 1) * pageSize;
      const slicedData = data.slice(offset, offset + pageSize);
      const numResults = response.data.length;
      
      console.log('currentPage: ' + currPage);
      console.log('offset: ' + offset);
      console.log('total pages: ' + Math.ceil(numResults/pageSize));
      console.log(slicedData);

      setTotalPages(Math.ceil(numResults/pageSize));
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
    } catch (error) {
      console.log('error fetching query1');
    }
  }

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await fetchQuery1(pageNumber);
  };

  useEffect(() => {
    fetchQuery1(1);
  }, []);

  return (
    <Container>
      <Typography align='left' variant="h3" marginTop={3} marginBottom={3}>Welcome to ScholarStreets!</Typography>

      <Typography variant="p">Our mission is to provide users accurate data about real estate,
      schools and education history data for various locations in the United States. Our website is composed
      of four main features:
      </Typography>

      <Grid container spacing={2}>
      {data && data.map((row, index) => {
        console.log(row)
        return <Grid  item key={row.id} xs={12} sm={6} md={4}>
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