import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";

import Nav from "./components/Navbar/navbar";
import HomePage from "./pages/HomePage";
import Mapbox from "./components/Map/map copy";

function App() {
  return (
    <div className="App">
      <Nav />
      <h1>Title</h1>
      <h1>Heiligerhuegel</h1>
      <hr />
      <h1>Mapbox:</h1>
      <Mapbox />
      <hr />
      <h1>Homepage:</h1>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
