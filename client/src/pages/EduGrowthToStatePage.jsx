import React, { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { HoverButton } from '../components/HoverButton';
import {
    Container,
    Grid,
    Button,
    Typography,
    Box,
    TextField,
    Card,
    CardContent,
    Dialog,
    DialogContent,
} from "@mui/material";
import {
    Slider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
} from "@mui/material";
import { styled } from '@mui/system';
import ListOfSchoolsCard from "../components/ListOfSchoolsCard";

const config = require("../config.json");
const serverPath = `http://${config.server_host}:${config.server_port}`;

export default function EduGrowthToStatePage() {
    // query 3 states
    const [minPrice, setMinPrice] = useState(100000);
    const [maxPrice, setMaxPrice] = useState(600000);
    const [pageQ3, setPageQ3] = useState(1);
    const [resultsQ3, setResultsQ3] = useState([]);
    const [searchInitiated, setSearchInitiated] = useState(false);

    // query 8 states
    const [priceMin, setPriceMin] = useState(100000);
    const [priceMax, setPriceMax] = useState(600000);
    const [occupants, setOccupants] = useState(4);
    const [space, setSpace] = useState("medium");
    const [results, setResults] = useState([]);
    const [loadingQ8, setLoadingQ8] = useState(false);

    // query 8 submit handler
    const fetchQuery8 = async () => {
        setLoadingQ8(true);

        const response = await axios.get(`${serverPath}/api/areas/zips/occupancy`, {
            params: {
                price_min: priceMin,
                price_max: priceMax,
                P: occupants,
                S: space,
            },
        });
        console.log(response.data);
        // Map the data to the structure expected by DataGrid
        const data = response.data.map(item => ({
            id: item.house_id,
            STATE: item.STATE,
            city: item.city,
            zip_code: item.zip_code,
            price: item.price,
            AVG_SCORE: item.AVG_SCORE,
        }));
        setResults(data);
        setLoadingQ8(false);
    };

    // states for dialogue content for query 4 
    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState({});

    // functions for dialogue content for query 4
    const handleClickOpen = (rowData) => {
        setCurrentRow(rowData);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // query 3 handlers
    const handleSearchHousesByTopStates = async () => {
        setSearchInitiated(true);
        await fetchQuery3(1); // Fetch for the first page
    };

    const fetchQuery3 = async (page) => {
        try {
            console.log(page);
            const response = await axios.get(
                `${serverPath}/api/houses/growing/?min_price=${minPrice}&max_price=${maxPrice}&page=${page}&pageSize=10`
            );
            setResultsQ3(response.data);
            console.log(response.data);
        } catch (err) {
            console.log("Error fetching data: ", err);
            setResultsQ3([]);
        }
    };

    const nextPageQ3 = async (page) => {
        if (resultsQ3.length === 10) {
            setPageQ3(page);
            await fetchQuery3(page);
        }
    };

    const prevPageQ3 = async (page) => {
        if (page >= 1) {
            setPageQ3(page);
            await fetchQuery3(page);
        }
    };

    return (
        <Container>
            <Grid
                container
                spacing={2}
                style={{ marginTop: "1rem", marginBottom: "2rem" }}
            >
                {/* Query 3 */}
                <Grid item xs={12}>
                <Grid container spacing={3}>
                        <Grid item xs={5}>
                            <Typography variant="h3">Initial Search</Typography>
                            <Typography>
                                This initial search will perform a search on houses that are in
                                the top 20 States with the fastest higher education growth in
                                the past 10 years. Enter the price range that you feel is right
                                for you!
                            </Typography>
                        </Grid>
                        <hr />

                        <Grid item xs={2}>
                            <Box sx={{ marginTop: "1rem", marginBot: "1rem" }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Maximum Price"
                                    defaultValue="600000"
                                    onChange={(event) =>
                                        setMaxPrice(parseFloat(event.target.value) || 600000)
                                    }
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Box sx={{ marginTop: "1rem", marginBot: "1rem" }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Minimum Price"
                                    defaultValue="10000"
                                    onChange={(event) =>
                                        setMinPrice(parseFloat(event.target.value) || 10000)
                                    }
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSearchHousesByTopStates}
                                sx={{ width: "100%", marginTop: "2rem", marginBot: "2rem" }}
                            >
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                    <hr style={{ marginTop: "2rem", marginBottom: "1rem" }} />

                    <Typography variant="h5" style={{ marginBottom: "1rem" }}>
                        {" "}
                        Houses in the top 20 Higher Education growth states:{" "}
                    </Typography>
                    <Grid
                        container
                        spacing={2}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        {resultsQ3.length > 0 ? (
                            resultsQ3.map((house, index) => (
                                <Grid item key={index} xs={2.4} sm={2.4} md={2.4} lg={2.4}>
                                    <Card raised>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                House Details
                                            </Typography>
                                            <Typography variant="body2">
                                                State: {house.STATE}
                                            </Typography>
                                            <Typography variant="body2">
                                                10-Year Higher Education Growth:{" "}
                                                {100 * house.avg_higher_edu_growth}%
                                            </Typography>
                                            <Typography variant="body2">Beds: {house.bed}</Typography>
                                            <Typography variant="body2">
                                                Baths: {house.bath}
                                            </Typography>
                                            <Typography variant="body2">
                                                City: {house.city}
                                            </Typography>
                                            <Typography variant="body2">
                                                House ID: {house.house_id}
                                            </Typography>
                                            <Typography variant="body2">
                                                House Size: {house.house_size} sq ft
                                            </Typography>
                                            <Typography variant="body2">
                                                Price: ${house.price.toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2">
                                                ZIP Code: {house.zip_code}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : searchInitiated ? (
                            <Typography style={{ marginTop: "5rem", marginBottom: "3rem" }}>
                                Rendering results ...{" "}
                            </Typography>
                        ) : (
                            <Typography style={{ marginTop: "5rem", marginBottom: "3rem" }}>
                                No Search yet. Please initiate a search to see results.
                            </Typography>
                        )}
                    </Grid>
                    <Button
                        onClick={() => prevPageQ3(pageQ3 - 1)}
                        disabled={!searchInitiated || pageQ3 === 1}
                        style={{ marginTop: "1rem" }}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => nextPageQ3(pageQ3 + 1)}
                        disabled={!searchInitiated || resultsQ3.length < 10}
                        style={{ marginTop: "1rem" }}
                    >
                        Next
                    </Button>
                    <hr style={{ marginTop: "2rem", marginBottom: "1rem" }} />
                </Grid>

                {/* Query 8*/}
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={5}>
                            <Typography variant="h3">Double Search - Ranking System</Typography>
                            <Typography>
                                This double search will rank houses from the top areas returned by previous query.
                                Enter the price range, number of occupants, and average
                                space per person that you feel is right for you! We use a smart
                                ranking system in the back with lots of math to give the best
                                ranking on the houses we obtained from previous query.
                            </Typography>
                        </Grid>
                        <Grid item xs={7} container spacing={1}>
                            <Grid item xs={6}>
                                <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Minimum Price"
                                        defaultValue={priceMin}
                                        onChange={(event) =>
                                            setPriceMin(parseFloat(event.target.value) || 100000)
                                        }
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Maximum Price"
                                        defaultValue={priceMax}
                                        onChange={(event) =>
                                            setPriceMax(parseFloat(event.target.value) || 600000)
                                        }
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                                    <Typography id="discrete-slider" gutterBottom>
                                        Total Occupants
                                    </Typography>
                                    <Slider
                                        value={occupants}
                                        onChange={(e, newValue) => setOccupants(newValue)}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={1}
                                        max={10}
                                        style={{ marginRight: "1rem" }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box sx={{ marginTop: "1rem", marginBottom: "1rem", padding: "0.5rem", width: "100%" }}>
                                    {/* text label */}
                                    <FormControl style={{ minWidth: 160 }}>
                                        <InputLabel id="space-label">Space per Person</InputLabel>
                                        <Select
                                            labelId="space-label"
                                            id="space-select"
                                            value={space}
                                            onChange={(e) => setSpace(e.target.value)}
                                        >
                                            <MenuItem value={"small"}>Small</MenuItem>
                                            <MenuItem value={"medium"}>Medium</MenuItem>
                                            <MenuItem value={"large"}>Large</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={fetchQuery8}
                                    sx={{ width: "100%", marginTop: "2rem", marginBot: "2rem" }}
                                >
                                    Search
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" style={{ marginBottom: "1rem" }}>
                        {" "}
                        Houses ranked based on occupancy and average space per person:{" "}
                    </Typography>
                    {loadingQ8 ? (
                        <div>
                            <CircularProgress />
                            <Typography variant="h6">Analyzing and ranking all houses...</Typography>
                        </div>
                    ) : (
                        <div style={{ height: 400, width: "90%" }}>
                            <DataGrid
                                rows={results}
                                localeText={{ noRowsLabel: "Please enter valid inputs and click search to see results" }}
                                columns={[
                                    { field: 'id', headerName: 'House ID', width: 120 },
                                    { field: 'STATE', headerName: 'State', width: 100 },
                                    { field: 'city', headerName: 'City', width: 130 },
                                    { field: 'zip_code', headerName: 'ZIP Code', width: 130 },
                                    {
                                        field: 'price',
                                        headerName: 'Price',
                                        width: 120,
                                        valueFormatter: ({ value }) => `$${value.toLocaleString()}`,
                                    },
                                    {
                                        field: 'AVG_SCORE',
                                        headerName: 'Smart Match %',
                                        width: 130, type: 'number',
                                        valueFormatter: ({ value }) => `${value * 100}%`
                                    },
                                    {
                                        field: 'renderCell',
                                        headerName: 'Schools in Area',
                                        width: 150,
                                        renderCell: (params) => {
                                            return (
                                                <HoverButton onClick={() => handleClickOpen(params.row)}>
                                                    {/* nothing here for now */}
                                                </HoverButton>

                                            );
                                        },
                                    },
                                ]}
                            />
                        </div>
                    )}
                </Grid>
            </Grid>
            <Dialog fullWidth maxWidth="xl" open={open} onClose={handleClose} aria-labelledby="school-list">
                <DialogContent>
                    {/* make sure you pass state and city from row data */}
                    {console.log(currentRow)}
                    <ListOfSchoolsCard state={currentRow.STATE} city={currentRow.city} />
                </DialogContent>
            </Dialog>
        </Container>
    );
}
