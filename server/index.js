const express = require('express');
const axios = require('axios');
const PORT = 4000;
const app = express();
const fetch = require('node-fetch');
const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');
const request = require('request');
const httpProxy = require('express-http-proxy')

// Allow CORS
app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});


app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Quake API</h1>');
});

app.get('/quakes', async (req, res) => {
  console.log(req.query)
  const magnitude = req.query.magnitude
  const longitude = req.query.longitude
  const latitude = req.query.latitude
  const radius = req.query.radius
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson`

  await axios.get(url)
    .then(response => {
        console.log(response.data.status);
        console.log(response.data);
        res.json(response.data);
    })
    .catch(error => {
        console.log(error);
    });
});



app.use('/', createProxyMiddleware({ target: 'https://earthquake.usgs.gov/fdsnws/event/1', changeOrigin: true }));

app.listen(PORT, () => {
 console.log(`Server is listening on port: ${PORT}`);
});