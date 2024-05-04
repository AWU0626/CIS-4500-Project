import React, { useState } from "react";
import axios from 'axios';
import { Container, Grid, Button, Typography, Box, TextField, Card, CardContent } from '@mui/material';

const config = require('../config.json');
const serverPath = `http://${config.server_host}:${config.server_port}`;

export default function SchoolCityInfoCard(props) {
    const school = props.school;
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000000);
    const [numBed, setNumBed] = useState(0);
    const [numBath, setNumBath] = useState(0);

    // query9
    const [pageQ9, setPageQ9] = useState(1);
    const [resultsQ9, setResultsQ9] = useState([]);

    //query 10
    const [pageQ10, setPageQ10] = useState(1);
    const [resultsQ10, setResultsQ10] = useState([]);

    const [searchInitiated, setSearchInitiated] = useState(false);

    // pagination
    const nextPage = async (query, newPage) => {
        if (query === 'Q9' && resultsQ9.length === 10) {
            setPageQ9(newPage);
            await fetchQuery9(newPage);

        } else if (query === 'Q10' && resultsQ10.length === 10) {
            setPageQ10(newPage);
            await fetchQuery10(newPage);
        }
    };

    const prevPage = async (query, newPage) => {
        if (query === 'Q9' && newPage >= 1) {
            setPageQ9(newPage);
            await fetchQuery9(newPage);
        } else if (query === 'Q10' && pageQ10 > 1) {
            setPageQ10(newPage);
            await fetchQuery10(newPage);
        }
    };

    const handleClose = (e) => {
        console.log(school);
        props.onClose();
    }

    const fetchQuery9 = async (newPage) => {
        try {
            const response = await axios.get(`${serverPath}/api/houses/?min_price=${minPrice}&max_price=${maxPrice}&min_baths=${numBath}&min_beds=${numBed}&page=${newPage}&state=${school.STATE}`);
            setResultsQ9(response.data);
            console.log(response.data)
        } catch (err) {
            console.log('Error fetching data: ', err);
            setResultsQ9([]); 
        }
    }

    const fetchQuery10 = async (newPage) => {
        try {
            const response = await axios.get(`${serverPath}/api/areas/zips/prices/?min_price=${minPrice}&max_price=${maxPrice}&page=${newPage}&state=${school.STATE}`);
            setResultsQ10(response.data);
            console.log(response.data)
        } catch (err) {
            console.log('Error fetching data: ', err);
            setResultsQ10([]); 
        }
    }

    const handleSearch = async (currPage) => {
        setPageQ9(currPage);
        setPageQ10(currPage);
        await fetchQuery9(currPage);
        await fetchQuery10(currPage);
    }

    return (
        <Container>
            <Grid container item>
                <Grid item xs={4}>
                    <Typography color="text.primary">
                        Area Information:
                    </Typography>
                    <hr />
                    <Typography color="text.secondary">
                        State: {school.STATE}
                    </Typography>
                    <Typography color="text.secondary">
                        County: {school.COUNTY}
                    </Typography>
                    <Typography color="text.secondary">
                        City: {school.CITY}
                    </Typography>
                    <Typography color="text.secondary">
                        Average Number of Bathrooms: {school.avg_bath}
                    </Typography>
                    <Typography color="text.secondary">
                        Average Number of Bedrooms: {school.avg_bed}
                    </Typography>
                    <Typography color="text.secondary">
                        Average House Size: {school.avg_house_size} sq ft
                    </Typography>
                    <Typography color="text.secondary">
                        Average Price: ${school.avg_price.toFixed(2)}
                    </Typography>
                </Grid>

                <hr />

                <Grid item xs={5}>
                    <Typography color="text.primary">
                        House search criteria:
                    </Typography>
                    <hr />
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Box sx={{width: '100%', marginTop: "1rem", marginBot: "1rem"}}>
                                    <TextField required id="outlined-required" label="Maximum Price" 
                                        defaultValue="1000000000" onChange={(event) => setMaxPrice(parseFloat(event.target.value) || 1000000000)}/>
                                </Box>

                                <Box sx={{width: '100%', marginTop: "1rem", marginBot: "1rem"}}>
                                    <TextField required id="outlined-required" label="Number of Baths" 
                                        defaultValue="0" onChange={(event) => setNumBath(parseInt(event.target.value)) || 0}/>
                                </Box>
                            </Grid>

                            <Grid item xs={6} >
                                <Box sx={{width: '100%', marginTop: "1rem", marginBot: "1rem"}}>
                                    <TextField required id="outlined-required" label="Minimum Price" 
                                        defaultValue="0" onChange={(event) => setMinPrice(parseFloat(event.target.value)) || 0}/>
                                </Box>

                                <Box sx={{width: '100%', marginTop: "1rem", marginBot: "1rem", marginRight: "2rem"}}>
                                    <TextField required id="outlined-required" label="Number of Beds" 
                                        defaultValue="0" onChange={(event) => setNumBed(parseInt(event.target.value)) || 0}/>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <hr />
                <Grid item xs={1} alignContent={"center"}>
                    <Button variant="contained" color="primary" onClick={() => handleSearch(1)} sx={{width: '100%', marginTop: "2rem", marginBot: "2rem"}}>
                        Search
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleClose} sx={{width: '100%', marginTop: "2rem", marginBot: "2rem"}}>
                        Close
                    </Button>
                </Grid>

            </Grid>
            <hr style={{marginTop: "2rem", marginBottom: "1rem"}}/>

            {/* Implement q9 */}
            {resultsQ9.length > 0 ? (
                <div>
                    <Typography variant="h6" style={{marginBottom: "1rem"}}>Houses in {school.STATE}:</Typography>
                    <Grid container spacing={2}>
                        {resultsQ9.slice(0, 10).map((house, index) => (
                            <Grid item key={index} xs={2.4} sm={2.4} md={2.4} lg={2.4}>
                                <Card raised>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>House Details</Typography>
                                        <Typography variant="body2">House ID: {house.HOUSE_ID}</Typography>
                                        <Typography variant="body2">City: {house.CITY}</Typography>
                                        <Typography variant="body2">State: {house.STATE}</Typography>
                                        <Typography variant="body2">ZIP Code: {house.ZIP_CODE}</Typography>
                                        <Typography variant="body2">Price: ${house.PRICE.toLocaleString()}</Typography>
                                        <Typography variant="body2">Beds: {house.BED}</Typography>
                                        <Typography variant="body2">Baths: {house.BATH}</Typography>
                                        <Typography variant="body2">House Size: {house.HOUSE_SIZE} sq ft</Typography>
                                        <Typography variant="body2">Sold Date: {`${house.PREV_SOLD_MONTH}/${house.PREV_SOLD_DAY}/${house.PREV_SOLD_YEAR}`}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Button onClick={() => prevPage('Q9', pageQ9 - 1)} disabled={pageQ9 === 1} style={{marginTop: "1rem"}}>Previous</Button>
                    <Button onClick={() => nextPage('Q9', pageQ9 + 1)} disabled={resultsQ9.length < 10} style={{marginTop: "1rem"}}>Next</Button>
    
                    {/* Implement q10 */}
                    <hr style={{marginTop: "2rem", marginBottom: "1rem"}}/>
                    <Typography variant="h6" style={{marginBottom: "1rem"}}>Averae House Prices in {school.STATE} by ZIP Code:</Typography>
                    <Grid container spacing={2}>
                        {resultsQ10.slice(0, 10).map((zip, index) => (
                            <Grid item key={index} xs={2.4} sm={2.4} md={2.4} lg={2.4}>
                                <Card raised>
                                    <CardContent>
                                        <Typography variant="body2">ZIP Code: {zip.ZIP_CODE}</Typography>
                                        <Typography variant="body2">Average Price: ${parseInt(zip.AVG_PRICE).toLocaleString()}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Button onClick={() => prevPage('Q10', pageQ10 - 1)} disabled={pageQ10 === 1} style={{marginTop: "1rem"}}>Previous</Button>
                    <Button onClick={() => nextPage('Q10', pageQ10 + 1)} disabled={resultsQ10.length < 10} style={{marginTop: "1rem"}}>Next</Button>
                </div>
             ) : searchInitiated ? (
                <Typography style={{ marginTop: "5rem", marginBottom: "3rem" }}>Rendering results ... </Typography>
            ) : (
                <Typography style={{ marginTop: "5rem", marginBottom: "3rem" }}>No Search yet. Please initiate a search to see results.</Typography>
            )}
        </Container>
    );
}