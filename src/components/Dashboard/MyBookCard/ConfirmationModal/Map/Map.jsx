import React from "react";
import GoogleMapReact from "google-map-react";
import styles from "./Map.module.css";
const { REACT_APP_MAPS_API_KEY } = process.env;

const MapSection = ({ location, zoomLevel }) => (
  <div>
    <div className={styles.map}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: REACT_APP_MAPS_API_KEY }}
        defaultCenter={location}
        defaultZoom={zoomLevel}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) =>
          handleApiLoaded(
            map,
            maps,
            { lat: location.lat, lng: location.lng },
            location.address
          )
        }
      ></GoogleMapReact>
    </div>
  </div>
);

const handleApiLoaded = (map, maps, destination, facAddress) => {
  let facInfoWindow, infoWindow;

  facInfoWindow = new maps.InfoWindow();
  facInfoWindow.setPosition(destination);
  facInfoWindow.setContent(facAddress);
  facInfoWindow.open(map);

  var directionsService = new maps.DirectionsService();
  var directionsRenderer = new maps.DirectionsRenderer();

  infoWindow = new maps.InfoWindow();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent("Location Based on IP Address");
        infoWindow.open(map);
        directionsRenderer.setMap(map);
        var request = {
          origin: pos,
          destination: destination,
          travelMode: "DRIVING",
        };
        directionsService.route(request, function (response, status) {
          if (status === "OK") {
            directionsRenderer.setDirections(response);
            document.getElementById("pin").style.display = "none";
          }
        });
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter(), origin);
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter(), origin);
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos, origin) {
    infoWindow.setPosition(origin);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open();
  }
};

export default MapSection;
