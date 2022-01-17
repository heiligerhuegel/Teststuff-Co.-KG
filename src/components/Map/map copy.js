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

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [waypoints, setWaypoints] = useState(null);

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

  useEffect(() => {
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
          if (MapBoxdirections.getWaypoints().length < 23) {
            console.log(MapBoxdirections.getWaypoints());
            MapBoxdirections.addWaypoint(MapBoxdirections.getWaypoints().length, [event.lngLat.lng, event.lngLat.lat]);
          } else return;
        }
        console.log("Event:", event);
        console.log("MapBoxdirections:", MapBoxdirections);
        const setData = async () => {
          if (Object.keys(MapBoxdirections.getOrigin()).length !== 0) {
            await setStart(MapBoxdirections.getOrigin().geometry.coordinates);
          }
          if (Object.keys(MapBoxdirections.getDestination()).length !== 0) {
            await setEnd(MapBoxdirections.getDestination().geometry.coordinates);
          }
          if (MapBoxdirections.getWaypoints().length > 0) {
            console.log("XXXXX", MapBoxdirections.getWaypoints());
            await setWaypoints(MapBoxdirections.getWaypoints());
          }
        };
        setData();
      });
    });
  }, []);

  useEffect(() => {
    console.log("Start:", start);
    console.log("Waypoints:", waypoints);
    console.log("End:", end);
  }, [start, waypoints, end]);

  return (
    <div>
      <div ref={mapContainer} className="map-container"></div>
      <h6>Start: </h6>
      {start && (
        <p>
          {start[0]},{start[1]}
        </p>
      )}

      <hr />
      {waypoints && <h6>Waypoints:</h6>}
      {waypoints &&
        waypoints.map((element, index) => {
          return (
            <p>
              {index + 1}:{element.geometry.coordinates[0]},{element.geometry.coordinates[1]}
            </p>
          );
        })}
      <hr />
      <h6>End: </h6>
      {end && (
        <p>
          {end[0]},{end[1]}
        </p>
      )}
    </div>
  );
}

export default Mapbox;
