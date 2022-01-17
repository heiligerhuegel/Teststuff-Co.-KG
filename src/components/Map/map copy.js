import React, { useRef, useEffect, useState } from "react";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
//import { renderIntoDocument } from "react-dom/cjs/react-dom-test-utils.production.min";
import { addWaypoint } from "@mapbox/mapbox-gl-directions/src/actions";

mapboxgl.accessToken = "pk.eyJ1IjoiaGVpbGlnZXJodWVnZWwiLCJhIjoiY2t5YTJpeDIyMDFjNjJ1bGlkeng0YzFmMyJ9.L5F2jpTCLJpuwVhg81rQDA";

function Mapbox() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  const [directions, setDirections] = useState(null);

  const el = document.createElement("div");

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(1));
      setLat(map.current.getCenter().lat.toFixed(1));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(async () => {
    if (!map.current) return; // wait for map to initialize

    const MapBoxdirections = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/driving",
      steps: true,
      controls: { inputs: true, instructions: false },
      interactive: false,
    });
    map.current.addControl(MapBoxdirections, "top-left");

    map.current.on("load", () => {
      map.current.on("click", (event) => {
        if (Object.keys(MapBoxdirections.getOrigin()).length === 0) {
          MapBoxdirections.setOrigin([event.lngLat.lng, event.lngLat.lat]);
          console.log(MapBoxdirections.getOrigin());
        } else if (Object.keys(MapBoxdirections.getOrigin()).length !== 0 && Object.keys(MapBoxdirections.getDestination()).length === 0) {
          MapBoxdirections.setDestination([event.lngLat.lng, event.lngLat.lat]);
        } else if (Object.keys(MapBoxdirections.getOrigin()).length !== 0 && Object.keys(MapBoxdirections.getDestination()).length !== 0) {
          MapBoxdirections.addWaypoint(1, [event.lngLat.lng, event.lngLat.lat]);
        }
        console.log(event);
        console.log(MapBoxdirections);
      });
    });
  }, []);

  return (
    <div>
      <div ref={mapContainer} className="map-container">
        {/* <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div> */}
      </div>
    </div>
  );
}

export default Mapbox;
