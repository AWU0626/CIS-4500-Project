import { useEffect, useState } from "react";
import axios from 'axios';
import { Container, Grid, Link, Slider, TextField, Typography } from '@mui/material';
import { LineChart, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Line, Tooltip, CartesianGrid, Legend, PolarRadiusAxis } from 'recharts';

const config = require('../config.json');

export default function HomePage() {

  const [homeTitle, setHomeTitle] = useState('');
  const [data, setData] = useState([]);

  // just retrieves home page message
  const fetchHome = async () => {
    try {
      const response = await axios.get(`http://${config.server_host}:${config.server_port}/api`);
      setHomeTitle(response.data.message);
    } catch (error) {
      console.error('Error fetching home page message:', error);
    }
  };

  const query1 = async () => {
    try {
      const response = await axios.get(`http://${config.server_host}:${config.server_port}/api/areas/cities/education/`);
      const data = response.data;
      
      const arr = []; // stores each state-county timeline per slot
      for (let i = 0; i < data.length; i += 6) {
        const state_county = `${data[i].STATE}, ${data[i].AREA_NAME}`;
        const json = {};
        json[state_county] = [];
        for (let j = i; j < i + 6; j++) { // store timeline in dat
          const dat = {
            time: data[j].time,
            hs_below: data[j].hs_below,
            hs: data[j].hs,
            below_4: data[j]['4_below'],
            above_4: data[j]['4_above']
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

  useEffect(() => {
    query1();
  }, []);

  return (
    <Container>
      <Typography align='left' variant="h4" marginTop={3}>Welcome to ScholarStreets!</Typography>

      <p>description of the website blah blah</p>

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
    </Container>
  );
};