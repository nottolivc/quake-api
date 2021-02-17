import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import ReactPaginate from 'react-paginate'; 
import Table from 'react-bootstrap/Table';

import Form from './components/Form';
import Header from './components/Header';


const App = () => {

  const [quakes, setQuakes] = useState([]);
  const [location, setLocation] = useState('');
  const [magnitude, setMagnitude] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loaded, isLoading] = useState(false);
  const [medianMag, setMedian] = useState('');

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
  let earthquakes = []

  const PER_PAGE = 100;
  const offset = PER_PAGE;
  const pageCount = Math.ceil(quakes.length / PER_PAGE);
  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }
  
  let magnitudes = []

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
    <Header />
    <Form />
    <div className="container2">
    <p>Displaying top 100 of {quakes.length}</p>
    <p>Total Number of Earthquakes: {quakes.length}</p>
    <br />
        <h1>Top 100 Recent Earthquakes List</h1>
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
