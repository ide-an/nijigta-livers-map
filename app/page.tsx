"use client";
import Map from "./components/map"
import MapControl from "./components/map_control";
import livers from "./data/livers.json";
import { Liver } from "./data/liver";
import { useState } from "react";

export default function Page() {
  const [selectedLivers, setSelectedLivers] = useState<Liver[]>(livers.filter((liver) => { return liver.tags.includes("DROPS") }));
  const [gtaDay, setGtaDay] = useState(1);
  const [gtaTime, setGtaTime] = useState(1718447025); // TODO: timestamp
  const [gtaTimeMin, setGtaTimeMin] = useState(1718445600); // TODO: timestamp gtadayできめる
  const [gtaTimeMax, setGtaTimeMax] = useState(1718474400);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
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

  return (
    <div className="flex flex-col md:flex-row flex-grow h-screen">
      <div className="flex-grow">
        <Map />
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
          onSelectedLiversChange={handleSelectedLiversChange}
          onGtaDayChange={handleGtaDayChange}
          onGtaTimeChange={handleGtaTimeChange}
          onIsPlayingChange={handleIsPlayingChange}
          onShowRouteChange={handleShowRouteChange}
        />
      </div>
    </div>
  );
}