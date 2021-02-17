import React, { useState } from 'react';
import axios from 'axios';

const Form = (props) => {


  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [start, setStartDate] = useState('2008-01-01');
  const [end, setEndDate] = useState('2020-01-01');
  const [radius, setRadius] = useState(200);
  const [magnitude, setMagnitude] = useState(0);
  const [quakesData, setData] = useState([]);
  const [magsVal, setMagsVal] = useState('');
  const [loaded, isLoading] = useState(false);
  const [medianMag, setMedian] = useState('');

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
  
const handleSubmit = async (e) => {
  e.preventDefault()
  const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson'
  const result = await axios.get(`${url}&starttime=${start}&endtime=${end}&minmagnitude=${magnitude}&minmagnitude=${5}&latitude=${latitude}&longitude=${longitude}&maxradiuskm=${radius}`);       
  setData(result.data.features);
  isLoading(true);
  earthquakes.push(result.data.features)
  magnitudes = result.data.features.map((s, item) => { return s.properties.mag });
  magnitudes.sort(function(a, b) { return a - b });
  setMagsVal(magnitudes.pop());
  let array = magnitudes
  function median(array){
    array.sort(function(a, b) {
      return a - b;
    });
    var mid = array.length / 2;
    return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
  }
  setMedian(median(array));
}

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
        <h4>Query Earthquakes (Closest Earthquakes in Range will Show)</h4>
        <p>Ordered by most Recent</p>
        <p>Start date</p>
        <input type="date" onChange={onChangeStart} value={start} />
        <p>End date</p>
        <input type="date" onChange={onChangeEnd} value={end} />
        <p>Min magnitude (0-10)</p>
        <input type="number" onChange={onChangeMag} value={magnitude} />
        <p>Latitude (-90, 90)</p>
        <input type="number" onChange={onChangeLat} value={latitude} />
        <p>Longitude (-180, 180)</p>
        <input type="number" onChange={onChangeLong} value={longitude} />
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
        <p>Min Magnitude: {magnitude}</p>
        <div>Max Magnitude: {loaded ? <p>{[magsVal]}</p> : <p>Loading...</p>}</div>
        <div>Median Magnitude: {loaded ? <p>{[medianMag]}</p> : <p>Loading...</p>}</div>
        <br />
    <h4>Quake Results Data Table</h4>
    {quakesData.map((s, item) => {
    
    return (
      <div key={item}>
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
              <span className="table__account-number">{s.properties.title}</span>
          </td>
          <td className="table__balance table__cell u-text-right u-font-mono">{s.properties.mag}</td>
          <td className="table__limit table__cell u-text-right u-font-mono">{getTime(s.properties.time)}</td>
          </tr>
          <tr className="table__row">
              <td className="table__account table__cell">
              <span className="table__account-name">{s.properties.place}</span>
              </td>
              <td className="table__balance table__cell u-text-right u-font-mono"></td>
              <span className="table__account-name">Coordinates</span>
              <span>{s.geometry.coordinates.map((s, item) => (
              <div key={item}>
                <td className="table__limit table__cell u-text-right u-font-mono">{s}</td>
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