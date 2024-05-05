import React, { useEffect, useState } from "react";
import axios from 'axios';
import {Container, Grid, TextField, Button, Slider, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";

const config = require('../config.json');

export default function DetailedFeaturesToCityPage() {
    // first, set initial state
    const [data, setData] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // 1 indexed
    const [totalPages, setTotalPages] = useState(0);
    const [allData, setAllData] = useState([]);
    const pageSize = 10; // limit to 10 because google maps api is expensive
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [numBedsMin, setNumBedsMin] = useState(0);
    const [numBathsMin, setNumBathsMin] = useState(0);
    const [enrollmentMin, setEnrollmentMin] = useState(0);
    const [teachersMin, setTeachersMin] = useState(20);
    const [startGrade, setStartGrade] = useState(1);
    const dataColumns = [
        {field: 'ZIP_CODE', headerName: 'Zip', width: 150},
        {field: 'CITY', headerName: 'City', width: 150},
        {field: 'AVG_PRICE', headerName: 'Avg Price', width: 150},
        {field: 'AVG_BED', headerName: 'Avg Beds', width: 150},
        {field: 'AVG_BATH', headerName: 'Avg Baths', width: 150},
        {field: 'TOTAL_HOUSES', headerName: 'Total Houses', width: 150},
        {field: 'TOTAL_SCHOOLS', headerName: 'Total Schools', width: 150},
        {field: 'AVG_STUDENT_TEACHER_RATIO', headerName: 'Avg Student Teacher Ratio', width: 150},
    ];

    // get results from query7
    const fetchQuery7 = async () => {
        // check if selectedState is null
        if (selectedState === null) {
            return;
        }
        try {
            const response = await axios.get(`http://${config.server_host}:${config.server_port}/api/areas/zips/recommended/${selectedState}/?page=${currentPage}&price_min=${priceRange[0]}&price_max=${priceRange[1]}&beds_min=${numBedsMin}&baths_min=${numBathsMin}&enrollment_min=${enrollmentMin}&teachers_min=${teachersMin}&start_grade=${startGrade}&page_size=${pageSize}`);
            setAllData(response.data);
            setCurrentPage(1);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container >
            <h2 align='center'>Recommended Zips</h2>
            <Grid container spacing={3} alignItems='center' justifyContent='center' style={{ marginBottom: '16px' }}>
                <Grid item xs={4}>
                    <Typography>Description TBD</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Grid container spacing={3} alignItems='center' justifyContent='center' style={{ marginBottom: '16px' }}>
                        <Grid item xs={4}>
                            <TextField label="State" variant="outlined" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label={"Min Beds"} variant="outlined" value={numBedsMin} onChange={(e) => {
                                const num = e.target.value
                                if (!isNaN(num)) {
                                    setNumBedsMin(num === '' ? 0 : parseInt(num))
                                } else {
                                    setNumBedsMin(numBedsMin)
                                }
                            }} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label={"Min Baths"} variant="outlined" value={numBathsMin} onChange={(e) => {
                                const num = e.target.value
                                if (!isNaN(num)) {
                                    setNumBathsMin(num === '' ? 0 : parseInt(num))
                                } else {
                                    setNumBathsMin(numBathsMin)
                                }
                            }} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label={"Min Enrollment"} variant="outlined" value={enrollmentMin} onChange={(e) => {
                                const num = e.target.value
                                if (!isNaN(num)) {
                                    setEnrollmentMin(num === '' ? 0 : parseInt(num))
                                } else {
                                    setEnrollmentMin(enrollmentMin)
                                }
                            }} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label={"Min Teachers"} variant="outlined" value={teachersMin} onChange={(e) => {
                                const num = e.target.value
                                if (!isNaN(num)) {
                                    setTeachersMin(num === '' ? 0 : parseInt(num))
                                } else {
                                    setTeachersMin(teachersMin)
                                }
                            }} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label={"Start Grade"} variant="outlined" value={startGrade} onChange={(e) => {
                                const num = e.target.value
                                if (!isNaN(num)) {
                                    setStartGrade(num === '' ? 0 : parseInt(num))
                                } else {
                                    setStartGrade(startGrade)
                                }
                            }} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label={"Min Price"} variant="outlined" value={priceRange[0]} onChange={(e) => {
                                const num = e.target.value
                                if (!isNaN(num)) {
                                    setPriceRange([priceRange[0], num === '' ? 0 : parseInt(num)])
                                } else {
                                    setPriceRange(priceRange)
                                }
                            }} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label={"Max Price"} variant="outlined" value={priceRange[1]} onChange={(e) => {
                                const num = e.target.value
                                if (!isNaN(num)) {
                                    setPriceRange([priceRange[0], num === '' ? 0 : parseInt(num)])
                                } else {
                                    setPriceRange(priceRange)
                                }
                            }} />
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" color="primary" onClick={fetchQuery7}>Search</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <DataGrid
                getRowId={(row) => row.ZIP_CODE}
                rows={allData}
                columns={dataColumns}
                pageSize={pageSize}
                rowsPerPageOptions={[10]}
                autoHeight
                page={currentPage - 1}
                onPageChange={(newPage) => setCurrentPage(newPage)}
            />

        </Container>
    );
}