import React, { useState } from "react";
import axios from 'axios';
import { Container, Grid, Button, Typography, Box, TextField, Card, CardContent } from '@mui/material';

const config = require('../config.json');
const serverPath = `http://${config.server_host}:${config.server_port}`;

export default function EduGrowthToStatePage() {
    const [minPrice, setMinPrice] = useState(10000);
    const [maxPrice, setMaxPrice] = useState(600000);
    const [pageQ3, setPageQ3] = useState(1);
    const [pageSizeQ3, setPageSizeQ3] = useState(10);
    const [resultsQ3, setResultsQ3] = useState([]);
    const [searchInitiated, setSearchInitiated] = useState(false);

    const handleSearchHousesByTopStates = () => {
        setPageQ3(1);
        setSearchInitiated(true);
        fetchQuery3();
    }

    const fetchQuery3 = async () => {
        try {
            const response = await axios.get(`${serverPath}/api/houses/growing/?min_price=${minPrice}&max_price=${maxPrice}&page=${pageQ3}&pageSize=${pageSizeQ3}`);
            setResultsQ3(response.data);
            console.log(response.data);

        } catch(err) {
            console.log('Error fetching data: ', err);
            setResultsQ3([]); 
        }
    }

    const nextPageQ3 = () => {
        if (resultsQ3.length === pageSizeQ3) {
            setPageQ3(pageQ3 + 1);
            fetchQuery3();
        }
    }

    const prevPageQ3 = () => {
        if (pageQ3 > 1) {
            setPageQ3(pageQ3 - 1);
            fetchQuery3();
        }
    }
    
    return (
        <Container>
            <Grid container spacing={2} style={{marginTop: "1rem", marginBottom: "2rem"}}>
                {/* Query 3 */}
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={5}>
                            <Typography>
                                This initial search will perform a search on houses that are in the top 20 States with the fastest higher education growth in the past 10 years. Enter the price range that you feel is right for you!
                            </Typography>
                        </Grid>
                        <hr />

                        <Grid item xs={2}>
                            <Box sx={{ marginTop: "1rem", marginBot: "1rem"}}>
                                <TextField required id="outlined-required" label="Maximum Price" 
                                    defaultValue="600000" onChange={(event) => setMaxPrice(parseFloat(event.target.value) || 600000)}/>
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Box sx={{marginTop: "1rem", marginBot: "1rem"}}>
                                <TextField required id="outlined-required" label="Minimum Price" 
                                    defaultValue="10000" onChange={(event) => setMinPrice(parseFloat(event.target.value) || 10000)}/>
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" color="primary" onClick={handleSearchHousesByTopStates} sx={{width: '100%', marginTop: "2rem", marginBot: "2rem"}}>
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                    <hr style={{marginTop: "2rem", marginBottom: "1rem"}}/>

                    <Typography variant="h5" style={{marginBottom:"1rem"}}> Houses in the top 20 Higher Education growth states: </Typography>
                    <Grid container spacing={2} justifyContent={"center"} alignItems={"center"}>
                        
                        {resultsQ3.length > 0 ? (
                            resultsQ3.slice(0, 10).map((house, index) => (
                                <Grid item key={index} xs={2.4} sm={2.4} md={2.4} lg={2.4}>
                                    <Card raised>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>House Details</Typography>
                                            <Typography variant="body2">State: {house.STATE}</Typography>
                                            <Typography variant="body2">10-Year Higher Education Growth: {100 * house.avg_higher_edu_growth}%</Typography>
                                            <Typography variant="body2">Beds: {house.bed}</Typography>
                                            <Typography variant="body2">Baths: {house.bath}</Typography>
                                            <Typography variant="body2">City: {house.city}</Typography>
                                            <Typography variant="body2">House ID: {house.house_id}</Typography>
                                            <Typography variant="body2">House Size: {house.house_size} sq ft</Typography>
                                            <Typography variant="body2">Price: ${house.price.toLocaleString()}</Typography>
                                            <Typography variant="body2">ZIP Code: {house.zip_code}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : searchInitiated ? (
                            <Typography style={{ marginTop: "5rem", marginBottom: "3rem" }}>Rendering results ... </Typography>
                        ) : (
                            <Typography style={{ marginTop: "5rem", marginBottom: "3rem" }}>No Search yet. Please initiate a search to see results.</Typography>
                        )}
                    </Grid>
                    <Button onClick={() => prevPageQ3()} disabled={pageQ3 === 1} style={{marginTop: "1rem"}}>Previous</Button>
                    <Button onClick={() => nextPageQ3()} disabled={resultsQ3.length < 10} style={{marginTop: "1rem"}}>Next</Button>
                    <hr style={{marginTop: "2rem", marginBottom: "1rem"}}/>

                </Grid>

                {/* Query 8, 4 */}
                <Grid item xs={4}>
                    Implement Query 8, and Query 4
                </Grid>
            </Grid>
        </Container>
    );
}