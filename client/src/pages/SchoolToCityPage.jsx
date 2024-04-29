import { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
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

    const columns = [
        { field: 'STATE_COUNTY', headerName: 'State And County', width: 200, renderCell: (params) => (
          <Link onClick={() => {
            const s = params.row.STATE_COUNTY.split(' ');
            setSelectedState(s[0]);
            setSelectedCounty(s[1]);
          }}>{params.value}</Link>
      ) },
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
              return { id: index, STATE_COUNTY: `${row.STATE} ${row.COUNTY}`, ...rest };
            });

            console.log(data);
            setData(data)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
        {selectedState && selectedCounty && <CountyStateCard state={selectedState} county={selectedCounty} handleClose={() => {setSelectedCounty(null); setSelectedState(null)}} />}
        <h2>Find Cities</h2>
        <Grid container spacing={2}>
        <Grid item xs={1}>
          <TextField label='num_student' value={numStudent} onChange={(e) =>{
            const num = e.target.value; 
            if (!isNaN(num)) {
                setNumStudent(parseInt(num));
            } else {
                setNumStudent(numStudent); // if types NaN then set it to what it is already
            }
            }} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={2}>
          <TextField label='num_faculty' value={numFaculty} onChange={(e) => {
            const num = e.target.value; 
            if (!isNaN(num)) {
                setnumFaculty(parseInt(num));
            } else {
                setnumFaculty(numFaculty);  // if types NaN then set it to what it is already
            }
            }} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={3}>
            <p>gradeRange</p>
            <Slider
            value={gradeRange}
            min={0}
            max={12}
            step={1}
            onChange={(e, newValue) => setGradeRange(newValue)}
            valueLabelDisplay='auto'
            />
        </Grid>
        </Grid>
        <Button onClick={() => fetchQuery5() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Search
        </Button>
        <h2>Results</h2>
        {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
        />
      </Container>
    );
}