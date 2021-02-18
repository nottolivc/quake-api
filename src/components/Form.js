import React, { useState } from 'react';
import axios from 'axios';
import MapContainer from './MapContainer';

const Form = (props) => {

const [location, setLocation] = useState('');
const [latitude, setLatitude] = useState(0);
const [longitude, setLongitude] = useState(0);
const [start, setStartDate] = useState('2008-01-01');
const [end, setEndDate] = useState('2020-01-01');
const [radius, setRadius] = useState(400);
const [magnitude, setMagnitude] = useState(0);
const [quakesData, setData] = useState([]);
const [magsVal, setMagsVal] = useState('');
const [loaded, isLoading] = useState(false);
const [medianMag, setMedian] = useState('');
  
const updateLat = ({ target }) => {
    var { value } = target;
    value = value.replace(/[^0-9-]+/g, '');
    var pattern = /([-])?([0-9]+)/g;
    var matches = value.match(pattern);
    if(matches){
      value = matches[0];
    }
    setLatitude(value);
  }

const updateLong = ({ target }) => {
    var { value } = target;
    value = value.replace(/[^0-9-]+/g, '');
    var pattern = /([-])?([0-9]+)/g;
    var matches = value.match(pattern);
    if(matches){
      value = matches[0];
    }
    setLongitude(value);
}

let earthquakes = []

const onChangeLoc = e => {
  setLocation(e.target.value);
}

const onChangeStart = e => {
  setStartDate(e.target.value);
}

const onChangeEnd = e => {
  setEndDate(e.target.value);
}

const onChangeRadius = e => {
  setRadius(e.target.value);
}

const onChangeLat = e => {
  setLatitude(e.target.value);
}

const onChangeLong = e => {
e.preventDefault()
  setLongitude(e.target.value);
}

const onChangeMag = e => {
  setMagnitude(e.target.value);
}

let magnitudes = []

// create dynamic api request handled by state with helper functions for median and magnitude
const handleSubmit = async (e) => {
  e.preventDefault()
  try {
      // works with base url http://localhost:4000 when running server locally
      const url = 'https://blooming-basin-73834.herokuapp.com/'
      const result = await axios.get(`${url}query?format=geojson&starttime=${start}&endtime=${end}&minmagnitude=${magnitude}&minmagnitude=${5}&latitude=${latitude}&longitude=${longitude}&maxradiuskm=${radius}`)       
      setData(result.data.features);
      isLoading(true);
      console.log(result);
      // O(n) add earthquakes from search
      earthquakes.push(result.data.features)

      magnitudes = result.data.features.map((s, item) => { return s.properties.mag });
      // O((n)) sort and pop O(1) for storing max magnitude value
      
      magnitudes.sort(function(a, b) { return a - b });
      setMagsVal(magnitudes.pop());
      let array = magnitudes
      
      // ~O(log(n)) median array value function 
      function median(array){
        array.sort(function(a, b) {
          return a - b;
        });
        var mid = array.length / 2;
        return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
        }
          setMedian(median(array));
        } catch (error) {
          console.log(error);
          alert(error);
      }
    }

    // create func to convert api long number time format to standard time form
    const getTime = (date) => {
      let now = new Date(date);
      return (
        (now.getMonth() + 1) + '-' +
        (now.getDate()) + '-' +
          now.getFullYear() + " " +
          now.getHours() + '-' +
          ((now.getMinutes() < 10)
              ? ("0" + now.getMinutes())
              : (now.getMinutes())) + ':' +
          ((now.getSeconds() < 10)
              ? ("0" + now.getSeconds())
              : (now.getSeconds())));
      }

return (    
    <>
    <div className="container1">
    <form onSubmit={handleSubmit} className="box">
      <br />
      <br />
        <h2>Query Earthquakes (Closest Earthquakes in Range will Show)</h2>
        <h4>Ordered by most Recent</h4>
        <p>Start date</p>
        <input type="date" onChange={onChangeStart} value={start} />
        <p>End date</p>
        <input type="date" onChange={onChangeEnd} value={end} />
        <p>Min magnitude (0-10)</p>
        <input type="range" min="0" max="10" onChange={onChangeMag} value={magnitude} />
        <p>Latitude (-90, 90)</p>
        <input onChange={updateLat} value={latitude} />
        <p>Longitude (-180, 180)</p>
        <input onChange={updateLong} value={longitude} />
        <br />
        <p>Radius (km)</p>
        <input type="number" onChange={onChangeRadius} value={radius} />
        <br />
        <br />
        <button type="submit">Submit Query</button>
        <br />
        <br />
    </form>
    </div>
    <section className="main">
        <br />
        <div><h3>Max Magnitude:</h3> {loaded ? <p>{[magsVal]}</p> : <p>Start Search...</p>}</div>
        <div><h3>Median Magnitude:</h3> {loaded ? <p>{[medianMag]}</p> : <p>Start Search...</p>}</div>
        <div>{loaded ? <h3>Search Results: {quakesData.length}</h3> : <p>Loading...</p>}</div>
        <br />
    </section>
    <h2>Quake Results Data Table</h2>
    <p>Min Magnitude: {magnitude}</p>
    {quakesData.map((quake, item) => {
      // store coordinates of earthquakes query
      console.log(quake.geometry.coordinates.map((item) => { return item }))
      let coordinates = []
      coordinates.push(quake.geometry.coordinates.map((item) => { return item}))
      console.log(coordinates[0][1])
      let latlong = coordinates[0][1];

    return (
      <div key={item}>
      <br />
      <br />
      <div className="table__wrap">
      <table className="table">
          <thead className="table__header">
          <tr className="table__row">
              <th className="table__cell u-text-left">Title and Location</th>
              <th className="table__cell u-text-right">Magnitude</th>
              <th className="table__cell u-text-right">Time</th>
          </tr>
          </thead>
          <tbody>
          <tr className="table__row">
          <td className="table__account table__cell">
              <span className="table__account-number">{quake.properties.title}</span>
          </td>
          <td className="table__balance table__cell u-text-right u-font-mono">{quake.properties.mag}</td>
              <td className="table__limit table__cell u-text-right u-font-mono">{getTime(quake.properties.time)}</td>
              </tr>
              <tr className="table__row">
                  <td className="table__account table__cell">
                  <span className="table__account-name">{quake.properties.place}</span>
                  </td>
                  <td className="table__balance table__cell u-text-right u-font-mono"></td>
                  <span className="table__account-name">Coordinates</span>
                  <span>{quake.geometry.coordinates.map((coord, item) => (
                  <div key={item}>
                    <td className="table__limit table__cell u-text-right u-font-mono">{coord}</td>
                  </div>
                  ))}
                </span>
              </tr>
              </tbody>
          </table>
          </div>
        </div>
        );
      })}
    </>
    );
}

export default Form;