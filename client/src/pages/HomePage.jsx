import { useEffect, useState } from 'react';
import axios from 'axios';

const config = require('../config.json');

export default function HomePage() {

  const [homeTitle, setHomeTitle] = useState('');

  // just retrieves home page message
  const fetchHome = async () => {
    try {
      const response = await axios.get(`http://${config.server_host}:${config.server_port}/api`);
      setHomeTitle(response.data.message);
    } catch (error) {
        console.error('Error fetching home page message:', error);
    }
  };

  useEffect(() => {
    fetchHome();
  }, []);

  return (
    <div>
      <h1>{homeTitle}</h1>
      Implements Query 1
    </div>
    
  );
};