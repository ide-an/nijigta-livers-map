"use client";

import { View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import React, { useEffect } from "react";
import { Map as OlMap } from "ol";
import 'ol/ol.css';

function Map() {
  useEffect(() => {
    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    const map = new OlMap({
      target: "map-container",
      layers: [osmLayer],
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });

    return () => map.setTarget(null!);
  }, []);

  return <div className="h-full w-full" id="map-container" />;
}

export default Map;