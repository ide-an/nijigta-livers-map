"use client";

import { Feature, View } from "ol";
import React, { useEffect, useState } from "react";
import { Map as OlMap } from "ol";
import 'ol/ol.css';
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import { Projection } from "ol/proj";
import { getCenter } from "ol/extent";
import { Probe } from "../data/probe";
import { set } from "ol/transform";
import { LineString } from "ol/geom";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Vector from "ol/layer/Vector";
import VectorSrouce from "ol/source/Vector";

function Map({
  probes,
  gtaTime,
  showRoute,
  isPlaying,
}:{
  probes: Probe[],
  gtaTime: number,
  showRoute: boolean,
  isPlaying: boolean,
}) {

  const [map, setMap] = useState<OlMap | null>(null);

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
    console.log("map", map);
    setMap(map);

    return () => map.setTarget(null!);
  }, []);

  useEffect(() => {
    if (!map){
      return;
    }
    // TODO: probeの描画
    for(const probe of probes) {
      const probePoints = probe.probePoints;
      const points = probePoints.map((point) => {
        return [point.x, point.y];
      });
      console.log("points", points);  
      const line = new LineString(points);
      const feature = new Feature({  geometry: line });
      feature.setStyle(new Style({   
        stroke: new Stroke({
          color: 'red',
          width: 2,
        }),
      }));
      map.addLayer(new Vector({
        source: new VectorSrouce({
          features: [feature],
        }),
      }));
    }
  },[probes, gtaTime, showRoute, isPlaying]);

  return <div className="h-full w-full" id="map-container" />;
}

export default Map;