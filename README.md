# ScholarStreets - CIS 4500 Final Project

## Overview
This project aims to assist users, particularly parents, in finding suitable schools, neighborhoods, and homes. It helps users make informed decisions when selecting a home to buy, with a strong emphasis on school quality and educational attainment history.

## Installation

### Server
1. Navigate to the `server` directory.
2. Run `npm install` to install server side dependencies.
3. Start the server with `npm start`

### Client
1. Navigate to the `client` directory.
2. Run `npm install` to install dependencies.
3. Start the client with `npm start` and access it at `localhost:3000`

## Dependencies

The project relies on the following major dependencies:

- **Node.js**: The runtime environment for the server.
- **Express**: The web application framework for Node.js.
- **React**: The front-end library for building user interfaces.
- **Material-UI**: The React UI framework for implementing Google's Material Design.
- **Axios**: The promise-based HTTP client for making requests.

All dependencies, except Node.js, can be installed via npm as specified in the package files.

## Database and Database Directory
The `data` directory houses three curated datasets pivotal to our project, alongside scripts utilized for data cleaning. 
Note that some preprocessing was conducted manually and is not reflected in the scripts.
![image](https://github.com/AWU0626/CIS-4500-Project/assets/104400478/767c549d-de9f-424d-acc1-94f027eb4c03)

Databse was MySQL hosted on AWS RDS. Here is the Relational Schema for reference
![image](https://github.com/AWU0626/CIS-4500-Project/assets/104400478/fc129a9d-8549-40d5-83a3-3a858b97b273)

## Query Optimization
To ensure optimal performance and user experience, we implemented various query optimization techniques:

- **Indexing**: Created indexes on frequently queried columns to improve search speed and efficiency.
- **Pagination**: Implemented pagination for large result sets to reduce memory usage and improve response times.
Here is the added section on query optimization:
- **Indexing and Temp Tables (Materialized Views)**: We strategically created indexes on frequently accessed columns and utilized temporary tables to reduce the computational complexity of complex queries.
- **Pushed-in selections and projection using relational algebra equivalences**: We applied relational algebra equivalences to reorder and simplify queries, allowing the database to efficiently execute them. We also utilized the Datagrip's Explain Plan to analyze and optimize query execution.

![image](https://github.com/AWU0626/CIS-4500-Project/assets/104400478/3e81e968-a8aa-4984-8923-ed2d373f501c)


## Team
Franci Branda-Chen, Aaron Wu, Hussain Zaidi, Jesse Zong
