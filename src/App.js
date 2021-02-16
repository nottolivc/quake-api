import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
//import useCustomForm from ''./useCustomForm';


const App = () => {

  const [quakes, setQuakes] = useState([]);
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(37);
  const [longitude, setLongitude] = useState(100);
  const [start, setStartDate] = useState('2020-01-02');
  const [end, setEndDate] = useState('2008-01-01');
  const [radius, setRadius] = useState(200);
  const [magnitude, setMagnitude] = useState(5);
  const [quakesData, setData] = useState([]);
  
  const [filtered, setFiltered] = useState([]);
  //const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {    
    axios.get(`http://localhost:4000/quakes`)
        .then(res => {
          setQuakes(res.data.features);
          //quakes = res.data.features;
          console.log(res.data.features);
        })
        .catch(err => {
          console.log(err)
        });
        setCurrentPage(currentPage);
  }, [])

    // useEffect(() => {
    //     const results = filtered.filter(res => res.name.toLowerCase().includes(result)
    //         ); 
    //     setData(results)
    //     }, [result])
    //     console.log(data)

  const onChangeLoc = e => {
      setLocation(e.target.value);
      //console.log(e.target.value);
  }

  const onChangeStart = e => {
      setStartDate(e.target.value);
      //console.log(e.target.value);
  }

  const onChangeEnd = e => {
      setEndDate(e.target.value);
      //console.log(e.target.value);
  }
 ;
  const onChangeRadius = e => {
      setRadius(e.target.value);
      //console.log(e.target.value);
  }

  const onChangeLat = e => {
      setLatitude(e.target.value);
      //console.log(e.target.value)
  }

  const onChangeLong = e => {
    e.preventDefault()
      setLongitude(e.target.value);
      //console.log(e.target.value)
  }

  const onChangeMag = e => {
      setMagnitude(e.target.value);
      //console.log(e)
}
 
  const fetchData = () => {
    try {
      const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson'
      const res = axios.get(`${url}&starttime=${start}&endtime=${end}&minmagnitude=${magnitude}&minmagnitude=${5}&latitude=${latitude}&longitude=${longitude}&maxradiuskm=${radius}`);       
      setData(res.data.features);
      console.table(res.data.features);
      setFiltered(res.data);
      console.log(res.data);
      console.log(res.data.features);
    } catch (err) {
        throw new Error(err);
      }
    };

  const PER_PAGE = 100;
  const offset = PER_PAGE;
  const pageCount = Math.ceil(quakes.length / PER_PAGE);
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson'
    const result = await axios.get(`${url}&starttime=2000-01-01&endtime=2020-01-02&minmagnitude=${magnitude}&minmagnitude=${5}&latitude=${latitude}&longitude=${longitude}&maxradiuskm=${radius}`);       
    setData(result.data.features);
    console.log(result)
    console.log(result.data)
    console.log(magnitude);
  }

  return (
    <>
    <div className="App">
    <h1>Quakes</h1>
    <form onSubmit={handleSubmit}>
    <p>Location</p>
    <input type="text" onChange={onChangeLoc} value={location} />
    <p>Start date</p>
    <input type="date" onChange={onChangeStart} value={start} />
    <p>End date</p>
    <input type="date" onChange={onChangeEnd} value={end} />
    <p>Min magnitude</p>
    <input type="number" onChange={onChangeMag} value={magnitude} />
    <p>Latitude</p>
    <input type="number" onChange={onChangeLat} value={latitude} />
    <p>Longitude</p>
    <input type="number" onChange={onChangeLong} value={longitude} />
    <br />
    <p>Radius (km)</p>
    <input type="number" onChange={onChangeRadius} value={radius} />
    <br />
    <br />
    <button type="submit">Submit Query</button>
    </form>
    <br />
    {quakesData.map((s, item) => {
      //console.table(s.properties.place, s.properties.mag, item);
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
         <p>Displaying top 100 of {quakes.length}</p>
        })}
    </div>
    </>
  );
}

export default App;
