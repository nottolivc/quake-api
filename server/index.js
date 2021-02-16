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

// const resp = axios({
//   method: "GET",
//   url: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson`,
//   params: {
//     magnitude: 1,
//     longitude: 100,
//     latitude: 37,
//     radius: 200,
//     starttime: '2008-01-01',
//     endtime: '2020-01-02',
//     location: 'China',
//   },
// });

// Retrieve just the data from the response
// const { data } = resp;
// console.log(resp);
// request.get('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson', (error, response, body) => {
//   if (error) {
//     return console.log(error)
//   }
//   console.log(JSON.parse(body))
//   //console.log(response)
// })

app.use('/api', createProxyMiddleware({ target: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson', changeOrigin: true }));

app.listen(PORT, () => {
 console.log(`Server is listening on port: ${PORT}`);
});