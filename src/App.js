import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import ReactPaginate from 'react-paginate'; 
import Table from 'react-bootstrap/Table';

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
  
  const [currentPage, setCurrentPage] = useState(0);
  const [loaded, isLoading] = useState(false);

  
  useEffect(() => {    
    axios.get(`http://localhost:4000/quakes`)
        .then(res => {
          setQuakes(res.data.features);
          //quakes = res.data.features;
          console.log(res.data.features);
          isLoading(true)
          navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
          });
        })
        .catch(err => {
          console.log(err)
        });
        setCurrentPage(currentPage);
  }, [currentPage])

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
  const pageCount = Math.ceil(quakes.length / PER_PAGE);
  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }
  
  let magnitudes = []
  let maxMagsVal;
  let medianMag;

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson'
    const result = await axios.get(`${url}&starttime=${start}&endtime=${end}&minmagnitude=${magnitude}&minmagnitude=${5}&latitude=${latitude}&longitude=${longitude}&maxradiuskm=${radius}`);       
    setData(result.data.features);
    console.log(result)
    console.log(result.data)
    earthquakes.push(result.data.features)
    console.log(earthquakes)
    console.log(result.data.features.map((s, item) => { return s.properties.mag }));
    magnitudes = result.data.features.map((s, item) => { return s.properties.mag });
    console.log(magnitudes);
    magnitudes.sort(function(a, b) { return a - b });
    console.log(magnitudes);
    maxMagsVal = magnitudes.pop();
    console.log(maxMagsVal);
    let array = magnitudes
    console.log(array)
    function median(array){
      array.sort(function(a, b) {
        return a - b;
      });
      var mid = array.length / 2;
      return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
    }
    console.log(median(array))
    medianMag = median(array)
  }

  const getTime = () => {
    let now = new Date();
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

  return (
    <>
    <header>
    <h1>Quakes Query</h1>
    </header>
    <div className="container1">
    <form onSubmit={handleSubmit} className="box">
      <br />
      <br />
    <p>Location (Closest Earthquakes will Show)</p>
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
    <br />
    <br />
    </form>
    </div>
    <div className="container2">
    <p>Displaying top 100 of {quakes.length}</p>
    <p>Min Magnitude: {magnitude}</p>
    <div>Max Magnitude: {loaded ? <p>{maxMagsVal}</p> : <p>Loading...</p>}</div>
    <div>Median Magnitude: {loaded ? <p>{medianMag}</p> : <p>Loading...</p>}</div>
    <p>Total Number of Earthquakes: {quakes.length}</p>
    <br />
       <>
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
        <h1>Top 100 Earthquakes List</h1>
        {loaded ? quakes.slice(offset, offset + PER_PAGE).map((s, item) => {
        return (
          <>
          <div key={s.id}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Magnitude</th>
                <th>Title</th>
                <th>Place</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{s.properties.mag}</td>
                <td>{s.properties.title}</td>
                <td>{s.properties.place}</td>
                <td>{getTime(s.properties.time)}</td>
                {/* <td><h5>{s.geometry.coordinates.map((item) => { return item })}</h5></td> */}
              </tr>
            </tbody>
          </Table>
        </div>
        </>);
        }) : <>
        <p>Loading...</p> 
        <img style={{width: '150px', height: '120px', textAlign: 'center'}} src="https://icon-library.com/images/spinner-icon-gif/spinner-icon-gif-10.jpg" 
        alt="Loading..." /> </>}
    </div>
    <ReactPaginate
      previousLabel={"Prev"}
      nextLabel={"Next"}
      pageCount={pageCount}
      onPageChange={handlePageClick}
      containerClassName={'container'}
      previousLinkClassName={'page'}
      breakClassName={'page'}
      nextLinkClassName={'page'}
      pageClassName={'page'}
      disabledClassNae={'disabled'}
      activeClassName={'active'}
    />
    </>
  );
}

export default App;
