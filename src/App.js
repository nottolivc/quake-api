import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {

  const [quakes, setQuakes] = useState([]);
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(37);
  const [longitude, setLongitude] = useState(100);
  const [start, setStartDate] = useState('2008-01-02');
  const [end, setEndDate] = useState('2020-01-01');
  const [radius, setRadius] = useState(200);
  const [magnitude, setMagnitude] = useState(5);
  const [quakesData, setData] = useState([]);
  //const [currentPage, setCurrentPage] = useState(0);
  //const [loaded, isLoading] = useState(false);

  useEffect(() => {    
    axios.get(`http://localhost:4000/quakes`)
        .then(res => {
          setQuakes(res.data.features);
          //quakes = res.data.features;
          console.log(res.data.features);
          //isLoading(true)
        })
        .catch(err => {
          console.log(err)
        });
        //setCurrentPage(currentPage);
  }, [])

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
  let earthquakes = []


  const PER_PAGE = 100;
  const offset = PER_PAGE;
  // const pageCount = Math.ceil(quakes.length / PER_PAGE);
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson'
    const result = await axios.get(`${url}&starttime=${start}&endtime=${end}&minmagnitude=${magnitude}&minmagnitude=${5}&latitude=${latitude}&longitude=${longitude}&maxradiuskm=${radius}`);       
    setData(result.data.features);
    console.log(result)
    console.log(result.data)
    earthquakes.push(result.data.features)
    console.log(earthquakes)
    console.log(magnitude);
  }


  const getTime = () => {
    var now = new Date();
    return ((now.getMonth() + 1) + '-' +
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
  
  //console.log(getTime(1572987142290));
  
  return (
    <>
    <div className="App">
    <div className="container">
    <h1>Quakes</h1>
    <form onSubmit={handleSubmit}>
    <p>Location (Closest Country will Show)</p>
    <input type="text" onChange={onChangeLoc} value={location} />
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
    </form>
    <br />
    </div>
    <div className="container2">
    <p>Displaying top 100 of {quakes.length}</p>
    <p>Min Magnitude: {magnitude}</p>
    <p>Max Magnitude: </p>
    <p>Total Number of Earthquakes: {quakes.length}</p>
    <br />
    {/* {
      //const minMags = Math.min(...mags)
      //const maxMags = Math.max(...mags)
      // const min = mags.reduce((a, b) => Math.min(a, b))
      // console.log(min)
      // const max = mags.reduce((a, b) => Math.max(a, b))
      // console.log(max)
      // const median = (mags) => {
      //   if (mags.length === 0) return 0;
      //     mags.sort(function(a,b){
      //       return a-b;
      //   });
      //   var half = Math.floor(mags.length / 2);
      //   if (mags.length % 2)
      //     return mags[half];
      //   return (mags[half - 1] + mags[half]) / 2.0;
      // }
      // console.log(median(mags))
      // console.log(mags.pop())
        <>
        <p>Max Magnitude{quakesData.map((s, item) => {
          let mags = []
          mags.push(s.properties.mag)}</p
        </>
      )
      })} */}
       <>
        <h4>Query Results Data Table</h4>
        {quakesData.map((s, item) => {
            return (
                <div key={item}>
                <div className="table__wrap">
                <table className="table">
                    <thead className="table__header">
                    <tr class="table__row">
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
        <h1>Top 100 Earthquakes List</h1>
        {quakes.slice(offset, offset + PER_PAGE).map((s, item) => {
        return (
          <>
          <div key={s.id}>
          <h2>{s.properties.title}</h2>
          <p>Place {s.properties.place}</p>
          <p>Magnitude {s.properties.mag}</p>
          <p>Time {s.properties.time}</p>
          <h5>Coordinates: </h5>
          <h5>{s.geometry.coordinates.map((item) => { return item })}</h5>
        </div>
        </>);
        })}
    </div>
    </div>
    </>
  );
}

export default App;
