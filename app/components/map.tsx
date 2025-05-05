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
import { createPortal } from "react-dom";
import { set } from "ol/transform";

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
  console.log("probepoint", probePoint);
  const feature = new Feature({
    geometry: point,
    type: "marker",
    videoUrl: probe.videoUrl,
    videoUrlWithTime: probePoint.videoUrl,
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
      // TODO: probe pointが video urlを直接持つのではなく動画内時刻を持つほうがよさそう？それなら時刻からurlを作れる
  return { t, x, y, videoUrl: currentPoint.videoUrl }; // video urlとしては直近通過した点のものを使う。 時刻からurlを作るには情報が足りてないため
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
  // popupの管理系
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupUrls, setPopupUrls] = useState<string[]>([]);
  const [popupNames, setPopupNames] = useState<string[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    popupRef.current = document.createElement("div");
    // create popup
    const popup = new Overlay({
      element: popupRef.current,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
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
    // zoomの調整
    map.getView().fit(extent, { size: map.getSize()! });
    const currentZoom = map.getView().getZoom();
    map.getView().setMinZoom(currentZoom!);
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
        popup.setPosition(undefined);
        setIsPopupOpen(false);
        return;
      }
      setIsPopupOpen(true);
      setPopupUrls(features.map((feature) => feature.get("videoUrlWithTime")));
      setPopupNames(features.map((feature) => feature.get("liverName")));
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
      {/*
       Overlay内のクリックが拾われずにMapに飛ぶ問題を回避するため、portalとしてreact管理下の要素としてPopup内部を埋め込む
      参考： https://github.com/openlayers/openlayers/issues/12848
      */}
      {popupRef.current &&
        createPortal(
          <MapPopup urls={popupUrls} names={popupNames} isOpen={isPopupOpen} />,
          popupRef.current!
        )}
    </>
  );
}
function MapPopup({
  urls,
  names,
  isOpen,
}: {
  urls: string[];
  names: string[];
  isOpen: boolean;
}) {
  return (
    <div
      className={`z-10 w-64 bg-white border border-gray-300 rounded p-2 shadow-md ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <ul>
        {urls.map((url, index) => {
          return (
            <li key={url}>
              <a
                href={url}
                className="text-blue-500 hover:text-blue-200"
                target="_blank"
                rel="noreferrer"
              >
                {names[index]}視点
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Map;
