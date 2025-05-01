"use client";
import Map from "./components/map"
import MapControl from "./components/map_control";
import livers from "./data/livers.json";
import { Liver } from "./data/liver";
import { DependencyList, use, useEffect, useRef, useState } from "react";
import { Probe } from "./data/probe";
import { getProbesByGtaDayAndLivers } from "./data/liver_probes";
import liverProbes from "./data/liver_probes.json";
import { set } from "ol/transform";

// https://css-tricks.com/using-requestanimationframe-with-react-hooks/
const useAnimationFrame = (callback: (deltaTime: number) => void, dependencies: DependencyList) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<number>(-1);
  const previousTimeRef = useRef<number>(null);

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime)
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, dependencies); // Make sure the effect runs only once
}

export default function Page() {
  // const [probes, setProbes] = useState<Probe[]>([]); // TODO: probeを取得してセットする
  const [selectedLivers, setSelectedLivers] = useState<Liver[]>(livers.filter((liver) => { return ["kanae", "sara-hoshikawa", "kuzuha"].some((id) => liver.id === id); })); // TODO: デフォルトで選択するライバーを決める
  const [gtaDay, setGtaDay] = useState(1);
  const [gtaTime, setGtaTime] = useState(1718447025); // TODO: timestamp
  const [gtaTimeMin, setGtaTimeMin] = useState(1718445600); // TODO: timestamp gtadayできめる
  const [gtaTimeMax, setGtaTimeMax] = useState(1718474400);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [playSpeedRatio, setPlaySpeedRatio] = useState(1); // 何倍速か
  // TODO: selectLiversやgtaDayの変化を拾ってprobeを更新する
  const probes = getProbesByGtaDayAndLivers(liverProbes, gtaDay, selectedLivers);

  const handleSelectedLiversChange = (livers: Liver[]) => {
    setSelectedLivers(livers);
  };
  const handleGtaDayChange = (day: number) => {
    setGtaDay(day);
    console.log("day", day);
  };
  const handleGtaTimeChange = (time: number) => {
    setGtaTime(time);
    console.log("time", time);
  };
  const handleShowRouteChange = (show: boolean) => {
    setShowRoute(show);
    console.log("show", show);
  };
  const handleIsPlayingChange = (isPlaying: boolean) => {
    setIsPlaying(isPlaying);
    console.log("isPlaying", isPlaying);
  };
  const handlePlaySpeedRatioChange = (ratio: number) => {
    setPlaySpeedRatio(ratio);
    console.log("playSpeedRatio", ratio.toString());
  };

  // GTAの時間を更新する
  useAnimationFrame((deltaTime) => {
    if (!isPlaying) {
      return;
    }
    setGtaTime(prev => {
      const newGtaTime = prev + deltaTime * playSpeedRatio / 1000;
      if (newGtaTime > gtaTimeMax) {
        setIsPlaying(false);
        return gtaTimeMax;
      }
      return newGtaTime;
    });
  }, [isPlaying, playSpeedRatio]);

  return (
    <div className="flex flex-col md:flex-row flex-grow h-screen">
      <div className="flex-grow">
        <Map
          probes={probes}
          gtaTime={gtaTime}
          showRoute={showRoute}
          isPlaying={isPlaying}
        />
      </div>
      <div className="w-full h-96 md:w-128 md:h-full bg-gray-200 overflow-y-scroll">
        <MapControl
          selectedLivers={selectedLivers}
          gtaDay={gtaDay}
          gtaTime={gtaTime}
          gtaTimeMin={gtaTimeMin}
          gtaTimeMax={gtaTimeMax}
          isPlaying={isPlaying}
          showRoute={showRoute}
          playSpeedRatio={playSpeedRatio}
          onSelectedLiversChange={handleSelectedLiversChange}
          onGtaDayChange={handleGtaDayChange}
          onGtaTimeChange={handleGtaTimeChange}
          onIsPlayingChange={handleIsPlayingChange}
          onShowRouteChange={handleShowRouteChange}
          onPlaySpeedRatioChange={handlePlaySpeedRatioChange}
        />
      </div>
    </div>
  );
}