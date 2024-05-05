import React, { useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';

const config = require("../config.json");
const serverPath = `http://${config.server_host}:${config.server_port}`;

export default function ListOfSchoolsCard(props) {
    // State declarations will go here
    const [ratioMin, setRatioMin] = useState(11);
    const [ratioMax, setRatioMax] = useState(450);
    const [schools, setSchools] = useState([]);
    const [loadingQ4, setLoadingQ4] = useState(false);


    const handleMinRatioChange = (event) => {
        setRatioMin(parseFloat(event.target.value) || 11);
    };

    const handleMaxRatioChange = (event) => {
        setRatioMax(parseFloat(event.target.value) || 450);
    };

    const handleSubmit = () => {
        fetchQuery4();
    };

    const fetchQuery4 = async () => {
        try {
            setLoadingQ4(true);
            const response = await axios.get(`${serverPath}/api/schools/ratio/`, {
                params: {
                    minStudentTeacherRatio: ratioMin,
                    maxStudentTeacherRatio: ratioMax,
                    state: props.state,
                    city: props.city,
                },
            });

            const data = response.data.map(item => ({
                id: item.school_id,
                state: item.state,
                city: item.city,
                county: item.county,
                address: item.address,
                name: item.name,
                zipCode: item.zip,
                startGrade: item.start_grade,
                endGrade: item.end_grade,
                enrollment: item.enrollment,
                studentTeacherRatio: item.student_teacher_ratio,
            }));

            setSchools(data);
            setLoadingQ4(false);
        } catch (error) {
            console.error('Failed to fetch schools because:', error);
        }
    };

    return (
        <Box m={2}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Box m={1}>
                        <Typography variant="h4">Search Schools</Typography>
                        <Typography>
                            Now you can look for Schools near this area.
                            Give us your desired Minimum and Maximum student to teacher(S/T) ratio and we will find a list of schools
                            in this city that meet your criteria. Note: Student to Teacher ratio is defined as Number of Students per 1 teacher
                            Usually a lower student teacher refers to more teachers per student which can hint towards higher quality and attention to each student
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Grid container justifyContent="flex-end" spacing={2}>
                        <Grid item xs={6}>
                            <Box m={1}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Minimum S/T Ratio"
                                    defaultValue={ratioMin}
                                    onChange={handleMinRatioChange}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box m={1}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Maximum S/T Ratio"
                                    defaultValue={ratioMax}
                                    onChange={handleMaxRatioChange}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Box m={1}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}
                            style={{ marginTop: '1rem', alignSelf: 'center' }}>
                            Submit
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} style={{ height: 500, width: '100%' }}>
                    {loadingQ4 ? (
                        <div>
                            <CircularProgress />
                        </div>
                    ) : (
                        <DataGrid
                            rows={schools}
                            localeText={{ noRowsLabel: "Click Submit to Initiate Search" }}
                            columns={[
                                { field: 'state', headerName: 'State', width: 50 },
                                { field: 'city', headerName: 'City', width: 120 },
                                { field: 'address', headerName: 'Address', width: 260 },
                                { field: 'name', headerName: 'Name', width: 340 },
                                { field: 'startGrade', headerName: 'Start Grade', width: 80 },
                                { field: 'endGrade', headerName: 'End Grade', width: 90 },
                                { field: 'enrollment', headerName: 'Enrollment', width: 90 },
                                { field: 'studentTeacherRatio', headerName: 'S/t Ratio', width: 80 },
                            ]}
                        />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}