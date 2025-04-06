"use client";

import { View } from "ol";
import React, { useEffect } from "react";
import { Map as OlMap } from "ol";
import 'ol/ol.css';
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import { Projection } from "ol/proj";
import { getCenter } from "ol/extent";

function Map() {
  useEffect(() => {

    // create base map layer
    const imaggeWidth = 6144;
    const imageHeight = 9216;
    const extent = [0, 0, imaggeWidth, imageHeight];
    const projection = new Projection({
      code: "static-image",
      units: "pixels",
      extent: extent,
      axisOrientation: "esu",
    });
    const mapLayer = new ImageLayer({
      source: new Static({
        url: '/img/map.png',
        projection: projection,
        imageExtent: extent,
      }),
    });

    // create map
    const map = new OlMap({
      target: "map-container",
      layers: [mapLayer],
      view: new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 2,
        minZoom: 1,
        maxZoom: 8,
      }),
    });

    return () => map.setTarget(null!);
  }, []);

  return <div className="h-full w-full" id="map-container" />;
}

export default Map;