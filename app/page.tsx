"use client";
import Map from "./components/map";
import MapControl from "./components/map_control";
import livers from "./data/livers.json";
import { Liver } from "./data/liver";
import { DependencyList, useEffect, useMemo, useRef, useState } from "react";
import LiverList from "./components/liver_list"; // Adjust the path as needed
import {
  filterLiverProbesByGtaDayAndLivers,
  getProbesFetcher,
} from "./data/liver_probes";
import liverProbes from "./data/liver_probes.json";
import useSWR from "swr";
import LiverSelectDialog from "./components/liver_select_dialog";
import { NavbarDefault } from "./components/navbar";
import { gtaDayTimestamps } from "./data/gta_day_timestamps";

// https://css-tricks.com/using-requestanimationframe-with-react-hooks/
const useAnimationFrame = (
  callback: (deltaTime: number) => void,
  dependencies: DependencyList
) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<number>(-1);
  const previousTimeRef = useRef<number>(null);

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, dependencies);
};

function AnimatedPage({
  selectedLivers,
  handleSelectedLiversChange,
  liverSelectComponent,
}: {
  selectedLivers: Liver[];
  handleSelectedLiversChange: (livers: Liver[]) => void;
  liverSelectComponent: React.ReactNode;
}) {
  const gtaDay1Timestamp = gtaDayTimestamps[0];
  const [gtaDay, setGtaDay] = useState(1);
  const [gtaTime, setGtaTime] = useState(gtaDay1Timestamp.startTimestamp); // TODO: 初回の表示ならendの方がいいか？
  const [gtaTimeMin, setGtaTimeMin] = useState(gtaDay1Timestamp.startTimestamp);
  const [gtaTimeMax, setGtaTimeMax] = useState(gtaDay1Timestamp.endTimeStamp);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRoute, setShowRoute] = useState(true);
  const [playSpeedRatio, setPlaySpeedRatio] = useState(1); // 何倍速か
  // GTAの時間を更新する
  useAnimationFrame(
    (deltaTime) => {
      if (!isPlaying) {
        return;
      }
      setGtaTime((prev) => {
        const newGtaTime = prev + (deltaTime * playSpeedRatio) / 1000;
        if (newGtaTime > gtaTimeMax) {
          setIsPlaying(false);
          return gtaTimeMax;
        }
        return newGtaTime;
      });
    },
    [isPlaying, playSpeedRatio]
  );

  const { data, error } = useSWR(
    filterLiverProbesByGtaDayAndLivers(liverProbes, gtaDay, selectedLivers).map(
      (probe) => probe.probePath
    ),
    getProbesFetcher
  );
  // TODO: probeの取得に失敗した場合のエラーハンドリング
  const probes = data || [];

  const handleGtaDayChange = (day: number) => {
    setGtaDay(day);
    setIsPlaying(false);
    const gtaDayTimestamp = gtaDayTimestamps.find((x) => x.gtaDay === day)!;
    setGtaTimeMin(gtaDayTimestamp?.startTimestamp);
    setGtaTimeMax(gtaDayTimestamp?.endTimeStamp);
    setGtaTime(gtaDayTimestamp?.startTimestamp);
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

  return (
    <div className="flex flex-col h-screen">
      <div className="h-[63.5px] md:h-[63.5px]">
        <NavbarDefault />
      </div>
      <div className="flex flex-col md:flex-row h-[calc(100vh-63.5px)] md:h-[calc(100vh-63.5px)]">
        <div className="flex-grow">
          <Map
            probes={probes}
            gtaTime={gtaTime}
            showRoute={showRoute}
            isPlaying={isPlaying}
          />
        </div>
        <div className="w-full h-80 md:w-128 md:h-full bg-gray-200 overflow-y-hidden">
          <MapControl
            selectedLivers={selectedLivers}
            gtaDay={gtaDay}
            gtaTime={gtaTime}
            gtaTimeMin={gtaTimeMin}
            gtaTimeMax={gtaTimeMax}
            isPlaying={isPlaying}
            showRoute={showRoute}
            playSpeedRatio={playSpeedRatio}
            onGtaDayChange={handleGtaDayChange}
            onGtaTimeChange={handleGtaTimeChange}
            onIsPlayingChange={handleIsPlayingChange}
            onShowRouteChange={handleShowRouteChange}
            onPlaySpeedRatioChange={handlePlaySpeedRatioChange}
            liverSelectComponent={liverSelectComponent}
          />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [selectedLivers, setSelectedLivers] = useState<Liver[]>(
    livers.filter((liver) => {
      return liver;
    })
  ); // TODO: デフォルトで選択するライバーを決める

  const handleSelectedLiversChange = (livers: Liver[]) => {
    setSelectedLivers(livers);
  };

  // FIXME: gtaTimeの変化でLiverListが再レンダリングされるのを防ぐために、このComponentからpropで入れている
  // HTML的な構造からは不自然だが、memo化でどうにかしようとしてもうまくいかなかった。
  // 参考： https://qiita.com/yokoto/items/ee3ed0b3ca905b9016d3
  return (
    <AnimatedPage
      selectedLivers={selectedLivers}
      handleSelectedLiversChange={handleSelectedLiversChange}
      liverSelectComponent={
        <>
          <LiverSelectDialog
            selectedLivers={selectedLivers}
            onSelectedLiversChange={handleSelectedLiversChange}
          />
          <LiverList livers={selectedLivers} />
        </>
      }
    />
  );
}
