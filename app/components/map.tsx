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
        // 明るい色の場合は暗く縁取りする
        color:
          colorCodeToYUVLuminence(liver.color) < 0.8 ? "#ffffff" : "#cccccc",
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
    vt: probePoint.vt,
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

const colorCodeToYUVLuminence = (colorCode:string) =>  {
  const r = parseInt(colorCode.slice(1,3), 16) / 255;
  const g = parseInt(colorCode.slice(3,5), 16) / 255;
  const b = parseInt(colorCode.slice(5,7), 16) / 255;
  return 0.298912 * r + 0.586611 * g + 0.114478 * b;
}

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
  const vt = currentPoint.vt + (t - currentPoint.t);
  return { t, x, y, vt };
};

const createVideoUrlWithTimestamp = (videoUrl: string, vt: number) => {
  if (videoUrl.includes("youtube") || videoUrl.includes("youtu.be")) {
    const t = Math.floor(vt);
    return videoUrl + "?t=" + t;
  } else if (videoUrl.includes("twitch")) {
    const h = Math.floor(vt/3600);
    const m = Math.floor((vt%3600) / 60);
    const s = Math.floor(vt % 60);
    return videoUrl + `?t=${h}h${m}m${s}s`;
  } else {
    throw new Error("Unknown video url: " + videoUrl);
  }
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
      setPopupUrls(
        features.map((feature) => {
          const videoUrl = feature.get("videoUrl");
          const vt = feature.get("vt");
          return createVideoUrlWithTimestamp(videoUrl, vt);
        })
      );
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
      if (probePoints.length === 0) {
        console.log("なぜかprobePontsが空", probe);
        continue;
      }
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
