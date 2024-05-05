import React from "react";
import axios from 'axios';

const config = require('../config.json');

export default function DetailedFeaturesToCityPage() {
    // first, set initial state
    const [data, setData] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // 1 indexed
    const [totalPages, setTotalPages] = useState(0);
    const [allData, setAllData] = useState([]);
    const pageSize = 9; // limit to 9 because google maps api is expensive
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [numBedsMin, setNumBedsMin] = useState(0);
    const [numBathsMin, setNumBathsMin] = useState(0);
    const [enrollmentMin, setEnrollmentMin] = useState(0);
    const [teachersMin, setTeachersMin] = useState(20);
    const [startGrade, setStartGrade] = useState(1);

    // get results from query7
    const fetchQuery7 = async () => {
        try {
            const response = await axios.get(`http://${config.server_host}:${config.server_port}/api/areas/zips/recommended/${selectedState}`);
            setAllData(response.data);
            setCurrentPage(1);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="body">
            <p>Implements Query 7, Query 2</p>
        </div>
    );
}