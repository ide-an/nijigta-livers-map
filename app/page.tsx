"use client";
import Map from "./components/map"
import MapControl from "./components/map_control";
import livers from "./data/livers.json";
import { Liver } from "./data/liver";
import { useEffect, useState } from "react";
import { Probe } from "./data/probe";

export default function Page() {
  const [probes, setProbes] = useState<Probe[]>([]); // TODO: probeを取得してセットする
  const [selectedLivers, setSelectedLivers] = useState<Liver[]>(livers.filter((liver) => { return liver.tags.includes("DROPS") }));
  const [gtaDay, setGtaDay] = useState(1);
  const [gtaTime, setGtaTime] = useState(1718447025); // TODO: timestamp
  const [gtaTimeMin, setGtaTimeMin] = useState(1718445600); // TODO: timestamp gtadayできめる
  const [gtaTimeMax, setGtaTimeMax] = useState(1718474400);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [playSpeedRatio, setPlaySpeedRatio] = useState(1); // 何倍速か
  // TODO: selectLiversやgtaDayの変化を拾ってprobeを更新する

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

  // TODO: 
  const updateProbes = () => {
    const liver = selectedLivers[0];
    const newProbe: Probe = {
      liver: liver,
      gtaDay: gtaDay,
      probePoints: [
        { t: 1718447025, x: 1000, y: 2000 },
        { t: 1718447080, x: 1100, y: 2100 },
        { t: 1718447140, x: 1200, y: 2400 },
        { t: 1718447200, x: 1300, y: 2900 },
        { t: 1718447260, x: 1400, y: 3600 },
      ]
    };
    console.log("updateProbes", newProbe);
    setProbes([newProbe]);
  }
  useEffect(() => {
    updateProbes();
  }, [selectedLivers, gtaDay]);

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