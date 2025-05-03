"use client";

import { Feature, MapBrowserEvent, Overlay, View } from "ol";
import React, { useEffect, useRef, useState } from "react";
import { Map as OlMap } from "ol";
import "ol/ol.css";
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import { Projection } from "ol/proj";
import { getCenter } from "ol/extent";
import { Probe, ProbePoint } from "../data/probe";
import { LineString, Point } from "ol/geom";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import VectorSrouce from "ol/source/Vector";
import { Liver } from "../data/liver";
import Icon from "ol/style/Icon";
import VectorImageLayer from "ol/layer/VectorImage";
import VectorLayer from "ol/layer/Vector";

const mapImageWidth = 6144;
const mapImageHeight = 9216;

const toMapCoord = (point: ProbePoint) => {
  return [point.x, mapImageHeight - point.y];
};
const createRouteLineFeature = (
  probePoints: ProbePoint[],
  liver: Liver,
  probe: Probe
) => {
  const line = new LineString(probePoints.map(toMapCoord));
  const feature = new Feature({
    geometry: line,
    type: "route",
    videoUrl: probe.videoUrl,
  });
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
    }),
  ]);
  return feature;
};
const createMarkerFeature = (
  probePoint: ProbePoint,
  liver: Liver,
  probe: Probe
) => {
  const point = new Point(toMapCoord(probePoint));
  const feature = new Feature({
    geometry: point,
    type: "marker",
    videoUrl: probe.videoUrl,
    liverName: liver.name,
    liverId: liver.id,
  });
  feature.setStyle(
    new Style({
      image: new Icon({
        src: liver.markerImageUrl,
        anchor: [0.5, 1.0],
        scale: 0.7,
      }),
    })
  );
  // TODO: マーカーをクリックしたときにポップアップで動画URLを表示する
  return feature;
};

const findNextPointIndex = (probePoints: ProbePoint[], t: number) => {
  return probePoints.findIndex((point) => {
    return point.t > t;
  });
};
const interpolatePoint = (
  currentPoint: ProbePoint,
  nextPoint: ProbePoint,
  t: number
) => {
  const x =
    currentPoint.x +
    ((nextPoint.x - currentPoint.x) * (t - currentPoint.t)) /
      (nextPoint.t - currentPoint.t);
  const y =
    currentPoint.y +
    ((nextPoint.y - currentPoint.y) * (t - currentPoint.t)) /
      (nextPoint.t - currentPoint.t);
  return { t, x, y };
};

function Map({
  probes,
  gtaTime,
  showRoute,
  isPlaying,
}: {
  probes: Probe[];
  gtaTime: number;
  showRoute: boolean;
  isPlaying: boolean;
}) {
  const [map, setMap] = useState<OlMap | null>(null);
  const [routeVectorSource, setRouteVectorSource] =
    useState<VectorSrouce | null>(null);
  const [markerVectorSource, setMarkerVectorSource] =
    useState<VectorSrouce | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // create popup
    const popup = new Overlay({
      element: popupRef.current!,
    });
    // create base map layer
    const extent = [0, 0, mapImageWidth, mapImageHeight];
    const projection = new Projection({
      code: "static-image",
      units: "pixels",
      extent: extent,
      axisOrientation: "esu",
    });
    const mapLayer = new ImageLayer({
      source: new Static({
        url: "/img/map.png",
        projection: projection,
        imageExtent: extent,
      }),
    });

    // create map
    const map = new OlMap({
      target: "map-container",
      layers: [mapLayer],
      overlays: [popup],
      view: new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 2,
        minZoom: 1,
        maxZoom: 8,
      }),
    });
    // console.log("map", map);
    const routeVectorSource = new VectorSrouce({
      features: [],
    });
    map.addLayer(
      new VectorImageLayer({
        source: routeVectorSource,
      })
    );
    const markerVectorSource = new VectorSrouce({
      features: [],
    });
    map.addLayer(new VectorLayer({ source: markerVectorSource }));
    setMap(map);
    setRouteVectorSource(routeVectorSource);
    setMarkerVectorSource(markerVectorSource);
    // popupの表示
    map.on("singleclick", (evt: MapBrowserEvent) => {
      console.log("click", evt.coordinate);
      const features = map
        .getFeaturesAtPixel(evt.pixel)
        .filter((feature) => feature.get("type") === "marker");
      if (features.length === 0) {
        popupRef.current!.innerHTML = "";
        popup.setPosition(undefined);
        return;
      }
      popupRef.current!.innerHTML = features
        .map((feature) => {
          const videoUrl = feature.get("videoUrl") as string;
          const liverName = feature.get("liverName") as string;
          // TODO: 動画内時刻の指定
          // FIXME: クリックが貫通してmapにいく
          // https://github.com/openlayers/openlayers/issues/12848
          // https://github.com/openlayers/openlayers/issues/6948
          return `<a href="${videoUrl}" target="_blank">${liverName} 視点</a>`;
        })
        .join("<br>");
      popup.setPosition(evt.coordinate);
    });
    return () => map.setTarget(null!);
  }, []);

  useEffect(() => {
    if (!routeVectorSource || !markerVectorSource) {
      return;
    }
    if (probes === undefined) {
      return;
    }
    routeVectorSource.clear();
    markerVectorSource.clear();
    // console.time("add features");
    for (const probe of probes) {
      const probePoints = probe.probePoints;
      const nextPointIndex = findNextPointIndex(probePoints, gtaTime);
      let visitedPoints: ProbePoint[] = [];
      if (nextPointIndex === 0) {
        // まだ点がない
        continue;
      } else if (nextPointIndex === -1) {
        // すべての点を通過している
        visitedPoints = probePoints;
      } else {
        //  次の点を補間で追加する
        visitedPoints = probePoints.slice(0, nextPointIndex);
        const interpolatePointResult = interpolatePoint(
          probePoints[nextPointIndex - 1],
          probePoints[nextPointIndex],
          gtaTime
        );
        visitedPoints.push(interpolatePointResult);
      }
      // console.log("points", points);
      if (showRoute) {
        // TODO: 毎回featureを作り直すとprobesが多いときにカクつく問題がある。どうにか差分更新の形にしたい
        const routeLineFeature = createRouteLineFeature(
          visitedPoints,
          probe.liver,
          probe
        );
        routeVectorSource.addFeature(routeLineFeature);
      }
      const markerFeature = createMarkerFeature(
        visitedPoints[visitedPoints.length - 1],
        probe.liver,
        probe
      );
      markerVectorSource.addFeature(markerFeature);
    }
    // console.timeEnd("add features");
    if (map) {
      map.render();
    }
  }, [probes, gtaTime, showRoute, isPlaying]);

  return (
    <>
      <div className="h-full w-full" id="map-container" />
      <div
        ref={popupRef}
        id="popup"
        className="ol-popup"
        style={popupStyle}
      ></div>
    </>
  );
}

const popupStyle = {
  position: "absolute",
  backgroundColor: "white",
  padding: "5px",
  borderRadius: "5px",
  border: "1px solid black",
  transform: "translate(-50%, -100%)",
  pointerEvents: "none",
  width: "220px",
  color: "black",
};
export default Map;
