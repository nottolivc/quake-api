import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const MapContainer = (props) => {
  const [ currentPosition, setCurrentPosition ] = useState({});

  const mapStyles = {        
    height: "40vh",
    width: "100%", textAlign: 'center'};
  
    const success = position => {
      const currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      setCurrentPosition(currentPosition);
    };
    
    useEffect(() => {
      navigator.geolocation.getCurrentPosition(success);
    }, [])
  
  console.log(currentPosition);
  return (
     <LoadScript googleMapsApiKey='AIzaSyAYzDz_ckVUDgSrY-qWMjgQ0LRwnSUl5-I'>
        {/* key above is public, no need to put in .ENV file */}
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={currentPosition}
        />
     </LoadScript>
  )
}
export default MapContainer;