const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Route files
const bootcamps = require('./routes/bootcamps');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load express
const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'devolopment') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

//
//
// Listening
const PORT = process.env.PORT;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
