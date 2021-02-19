import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const MapContainer = (props) => {
  const [ currentPosition, setCurrentPosition ] = useState({});

  const [map, setMap] = React.useState(null) 
  
  //const API_KEY=`${process.env.API_KEY}`
  //const API_KEY='AIzaSyAYzDz_ckVUDgSrY-qWMjgQ0LRwnSUl5-I'
  // using public api key no need to put it in env file for now
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAYzDz_ckVUDgSrY-qWMjgQ0LRwnSUl5-I'
  })

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

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
    })
  
  console.log(currentPosition);
  
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapStyles}
      center={currentPosition}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      { /* Child components, such as markers, info windows, etc. */ }
      <></>
    </GoogleMap>
    ) : <></>
  }

export default MapContainer;