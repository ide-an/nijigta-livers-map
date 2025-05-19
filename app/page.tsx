"use client";
import Map from "./components/map";
import MapControl from "./components/map_control";
import livers from "./data/livers.json";
import { Liver } from "./data/liver";
import { DependencyList, useEffect, useRef, useState } from "react";
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
import { IconButton } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";

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
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

function ErrorAlert() {
  const [open, setOpen] = useState(true);
  // const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  return (
    <div
      className={
        "flex flex-row fixed bottom-2 justify-between rounded-xl bg-blue-gray-800 text-white w-full md:w-1/2 p-4 z-99" +
        (open ? " block" : " hidden")
      }
    >
      <p>ライバー経路情報の読み込みに失敗しました。</p>
      <IconButton onClick={closeDrawer}>
        <FontAwesomeIcon icon={faX} />
      </IconButton>
    </div>
  );
}

function getShareUrl(
  location: Location | undefined,
  gtaDay: number,
  gtaTime: number,
  selectedLivers: Liver[]
) {
  if (!location) {
    return "";
  }
  const liversStr = selectedLivers.map((liver) => liver.id).join(",");
  const pageUrl = location.origin + location.pathname;
  return pageUrl + `?gtaDay=${gtaDay}&gtaTime=${gtaTime}&livers=${liversStr}`;
}

function orElseInt(param: string | null, defaultParam: number) {
  return param ? parseInt(param, 10) : defaultParam;
}

function AnimatedPage({
  selectedLivers,
  liverSelectComponent,
}: {
  selectedLivers: Liver[];
  liverSelectComponent: React.ReactNode;
}) {
  // TODO: share buttonで日付、時間、ライバーを指定したurlにしたい
  const defaultGtaDay = 1;
  const searchParam = useSearchParams();
  const [gtaDay, setGtaDay] = useState(
    // search paramがあればそっちで初期化
    orElseInt(searchParam.get("gtaDay"), defaultGtaDay)
  );
  const defaultGtaDayTimestamp =
    gtaDayTimestamps.find((x) => x.gtaDay == gtaDay) || gtaDayTimestamps[0];
  const [gtaTime, setGtaTime] = useState(
    orElseInt(searchParam.get("gtaTime"), defaultGtaDayTimestamp.endTimeStamp)
  );
  const [gtaTimeMin, setGtaTimeMin] = useState(
    defaultGtaDayTimestamp.startTimestamp
  );
  const [gtaTimeMax, setGtaTimeMax] = useState(
    defaultGtaDayTimestamp.endTimeStamp
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRoute, setShowRoute] = useState(true);
  const [playSpeedRatio, setPlaySpeedRatio] = useState(1); // 何倍速か
  const [location, setLocation] = useState<Location>();
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
  useEffect(() => {
    setLocation(window.location);
  }, []);

  const { data, error } = useSWR(
    filterLiverProbesByGtaDayAndLivers(liverProbes, gtaDay, selectedLivers).map(
      (probe) => probe.probePath
    ),
    getProbesFetcher
  );
  // probeの取得に失敗した場合のエラーハンドリング
  if (error) {
    console.log("failed to load liver probe", error);
  }
  const probes = data || [];

  const handleGtaDayChange = (day: number) => {
    setGtaDay(day);
    setIsPlaying(false);
    const gtaDayTimestamp = gtaDayTimestamps.find((x) => x.gtaDay === day)!;
    setGtaTimeMin(gtaDayTimestamp?.startTimestamp);
    setGtaTimeMax(gtaDayTimestamp?.endTimeStamp);
    setGtaTime(gtaDayTimestamp?.endTimeStamp);
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
  const shareUrl = getShareUrl(location, gtaDay, gtaTime, selectedLivers);

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
            shareUrl={shareUrl}
          />
        </div>
      </div>
      {error ? <ErrorAlert /> : ""}
    </div>
  );
}

export default function Page() {
  const searchParam = useSearchParams();
  const [selectedLivers, setSelectedLivers] = useState<Liver[]>(
    searchParam.get("livers")
      ? // search paramがあればそっちで初期化
        livers.filter((liver) => {
          return searchParam.get("livers")?.split(",").includes(liver.id);
        })
      : livers.filter((liver) => {
          // デフォルトでは主催陣
          return liver.tags.includes("主催");
        })
  );

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
