import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Modal } from '@mui/material';
import { LineChart, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Line, Tooltip, CartesianGrid, Legend, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
const config = require('../config.json');

export default function CountyStateCard({ state, county, handleClose }) {
  const [countyStateData, setCountyStateData] = useState([]);
  const [barRadar, setBarRadar] = useState(true);

  const fetchEducation = async () => {
    try {
        const response = await axios.get(`http://${config.server_host}:${config.server_port}/api/education/${state}/${county}`);
        console.log(response.data);
        const data = response.data.map(row => ({
            time: row.TIME,
            hs_below: row.hs_below,
            hs: row.hs,
            below_4: row['4_below'],
            above_4: row['4_above']
        }));
        setCountyStateData(data);
    } catch (error) {
        console.error(error);
    }
};

  useEffect(() => {
    fetchEducation();
  }, [state, county]); // if state or county changes, has to re-fetch for the education history



  const handleGraphChange = () => {
    setBarRadar(!barRadar);
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
      >
        <ButtonGroup>
          <Button disabled={barRadar} onClick={handleGraphChange}>Bar</Button>
          <Button disabled={!barRadar} onClick={handleGraphChange}>Time Graph</Button>
        </ButtonGroup>
        <div style={{ margin: 20 }}>
          { // This ternary statement returns a BarChart if barRadar is true, and a RadarChart otherwise
            barRadar
              ? (
                <ResponsiveContainer height={250}>
                  <BarChart width={730} height={250} data={countyStateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hs_below" fill="#8884d8" />
                    <Bar dataKey="hs" fill="#82ca9d" />
                    <Bar dataKey="below_4" fill="#82c2ca" />
                    <Bar dataKey="above_4" fill="#ca82c9" />
                    </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer height={250}>
                  <LineChart width={730} height={250} data={countyStateData}
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
              )
          }
        </div>
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
