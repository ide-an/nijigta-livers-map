"use client";

import { Feature, View } from "ol";
import React, { useEffect, useState } from "react";
import { Map as OlMap } from "ol";
import 'ol/ol.css';
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import { Projection } from "ol/proj";
import { getCenter } from "ol/extent";
import { Probe, ProbePoint } from "../data/probe";
import { set } from "ol/transform";
import { LineString, Point } from "ol/geom";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Vector from "ol/layer/Vector";
import VectorSrouce from "ol/source/Vector";
import { Liver } from "../data/liver";
import Icon from "ol/style/Icon";

const createRouteLineFeature = (probePoints: ProbePoint[], liver: Liver) => {
  const line = new LineString(probePoints.map((point) => {
    return [point.x, point.y]; // TODO: 座標の補正
  }))
  const feature = new Feature({ geometry: line });
  feature.setStyle([
    new Style({
      stroke: new Stroke({
        color: "#ffffff",
        width: 5,
      }),
    }),
    new Style({
      stroke: new Stroke({
        color: liver.color,
        width: 3,
      }),
    })
  ]);
  return feature;
};
const createMarkerFeature = (probePoint: ProbePoint, liver: Liver) => {
  const point = new Point([probePoint.x, probePoint.y]);
  const feature = new Feature({ geometry: point });
  feature.setStyle(new Style({
    image: new Icon({
      src: liver.markerImageUrl,
      anchor: [0.5, 1.0],
      scale: 0.7,
    }),
  }));
  return feature;
}

function Map({
  probes,
  gtaTime,
  showRoute,
  isPlaying,
}: {
  probes: Probe[],
  gtaTime: number,
  showRoute: boolean,
  isPlaying: boolean,
}) {

  const [map, setMap] = useState<OlMap | null>(null);
  const [routeVectorSource, setRouteVectorSource] = useState<VectorSrouce | null>(null);

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
    const vectorSource = new VectorSrouce({
      features: []
    });
    map.addLayer(new Vector({
      source: vectorSource,
    }));
    setMap(map);
    setRouteVectorSource(vectorSource);

    return () => map.setTarget(null!);
  }, []);

  useEffect(() => {
    if (!routeVectorSource) {
      return;
    }
    routeVectorSource.clear();
    // TODO: probeの描画
    for (const probe of probes) {
      const probePoints = probe.probePoints;
      const visitedPoints = probePoints.filter((point) => point.t < gtaTime)
      if (visitedPoints.length === 0) {
        continue;
      }
      // TODO: 次の点を補完で追加する
      // console.log("points", points);  
      const routeLineFeature = createRouteLineFeature(visitedPoints, probe.liver);
      routeVectorSource.addFeature(routeLineFeature);
      // TODO: マーカーの追加
      const markerFeature = createMarkerFeature(visitedPoints[visitedPoints.length - 1], probe.liver);
      routeVectorSource.addFeature(markerFeature);
    }
    if (map) {
      map.render();
    }
  }, [probes, gtaTime, showRoute, isPlaying]);

  return <div className="h-full w-full" id="map-container" />;
}

export default Map;