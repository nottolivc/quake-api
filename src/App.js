import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import ReactPaginate from 'react-paginate'; 
import Table from 'react-bootstrap/Table';

import Form from './components/Form';
import Header from './components/Header';
import MapContainer from './components/MapContainer';

const App = (props) => {

  const [quakes, setQuakes] = useState([]);
  const [location, setLocation] = useState('');
  const [magnitude, setMagnitude] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loaded, isLoading] = useState(false);
  const [medianMag, setMedian] = useState('');

  let latitude;
  let longitude;

  useEffect( async () => {    
    // http://localhost:4000/quakes will work as well as long as server installed & running locally
    // deployed api version here
    await axios.get(`https://blooming-basin-73834.herokuapp.com/quakes`)
        .then(res => {
          setQuakes(res.data.features);
          console.log(res.data.features);
          isLoading(true)
          navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is :", position.coords.latitude);
            latitude = position.coords.latitude;
            console.log("Longitude is :", position.coords.longitude);
            longitude = position.coords.longitude;
          });
        })
        .catch(err => {
          console.error(err)
        });
        setCurrentPage(currentPage);
  }, [currentPage])

  let earthquakes = []

  const PER_PAGE = 100;
  const offset = PER_PAGE;
  const pageCount = Math.ceil(quakes.length / PER_PAGE);
  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }
  
  let magnitudes = []
  
  // function to convert time to readable format, O(n)
  const getTime = (date) => {
    let now = new Date(date);
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
    <Header />
    <h5 style={{color: '#777'}}>Allow browser acccess to your location and search for activity near you</h5>
    <p>{latitude}</p> <p>{longitude}</p>
    <Form />
    <br />
    <MapContainer latitude={latitude} longtitude={longitude} {...props} />
    <br />
    <div className="container2">
    <p>Displaying top 100 of {quakes.length}</p>
    <p>Total Number of Earthquakes: {quakes.length}</p>
    <br />
        <h2>Top 100 Recent Earthquakes List</h2>
        {loaded ? quakes.slice(offset, offset + PER_PAGE).map((quake, item) => {
        
        return (
          <>
          <div key={item}>
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
                <td>{quake.properties.mag}</td>
                <td>{quake.properties.title}</td>
                <td>{quake.properties.place}</td>
                <td>{getTime(quake.properties.time)}</td>
                {/* <td><h5>Coordinates: {quake.geometry.coordinates.map((item) => { return item })}</h5></td> */}
              </tr>
            </tbody>
          </Table>
        </div>
        </>);
        }) : <>
        <p>Loading...</p> 
        <img style={{width: '150px', height: '120px', margin: '0 auto'}} src="https://icon-library.com/images/spinner-icon-gif/spinner-icon-gif-10.jpg" 
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