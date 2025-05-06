"use client";

import {
  ButtonGroup,
  IconButton,
  Select,
  Option,
  Switch,
  Typography,
} from "@material-tailwind/react";
import { Liver } from "../data/liver";
import { formatInTimeZone } from "date-fns-tz";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

export default function MapControl({
  selectedLivers,
  gtaDay,
  gtaTime,
  gtaTimeMin,
  gtaTimeMax,
  isPlaying,
  showRoute,
  playSpeedRatio,
  onGtaDayChange,
  onGtaTimeChange,
  onIsPlayingChange,
  onShowRouteChange,
  onPlaySpeedRatioChange,
  liverSelectComponent,
}: {
  selectedLivers: Liver[];
  gtaDay: number; // 1 - 10
  gtaTime: number; // unix timestamp
  gtaTimeMin: number; // unix timestamp
  gtaTimeMax: number; // unix timestamp
  isPlaying: boolean;
  showRoute: boolean;
  playSpeedRatio: number; // 何倍速か
  onGtaDayChange: (day: number) => void;
  onGtaTimeChange: (time: number) => void;
  onIsPlayingChange: (isPlaying: boolean) => void;
  onShowRouteChange: (show: boolean) => void;
  onPlaySpeedRatioChange: (ratio: number) => void;
  liverSelectComponent: React.ReactNode;
}) {
  // console.time("MapControl render");
  // ライバーカラーのborder。 globals.cssでsafelistに追加しているクラスと対応する
  const toBorderColorClass = (liver: any) => {
    return `border-${liver.id}-500`;
  };

  const gtaDate = new Date(gtaTime * 1000);
  const gtaDateString = formatInTimeZone(
    gtaDate,
    "Asia/Tokyo",
    "M/d HH:mm:ss"
  );
  // console.timeEnd("MapControl render");
  return (
    <div className="flex flex-col gap-6 py-6 px-4 overflow-y-hidden md:max-h-full h-full">
      <div className="flex flex-row gap-6 items-center">
        <div>
          {/* 日付選択 */}
          <Select
            label="日付"
            value={gtaDay.toString()}
            onChange={(val) => onGtaDayChange(Number(val))}
            size="sm"
          >
            <Option value="1">Day 1(6/15)</Option>
            <Option value="2">Day 2(6/16)</Option>
            <Option value="3">Day 3(6/17)</Option>
            <Option value="4">Day 4(6/18)</Option>
            <Option value="5">Day 5(6/19)</Option>
            <Option value="6">Day 6(6/20)</Option>
            <Option value="7">Day 7(6/21)</Option>
            <Option value="8">Day 8(6/22)</Option>
            <Option value="9">Day 9(6/23)</Option>
            <Option value="9.5">Day 9.5(6/24)</Option>
            <Option value="10">Day 10(6/24)</Option>
          </Select>
        </div>

        {/* 時刻表示 */}
        <div>
          <Typography variant="h5" className="block md:hidden">{gtaDateString}</Typography>
          <Typography variant="h3" className="hidden md:block">{gtaDateString}</Typography>
        </div>
      </div>

      {/* 再生・停止 */}
      {/* FIXME: プログレスバーが突き抜けてる。 https://github.com/creativetimofficial/material-tailwind/issues/836 と同根。いったんただのinput rangeに戻す */}
      <input
        type="range"
        value={gtaTime}
        onChange={(ev) => onGtaTimeChange(Number(ev.target.value))}
        min={gtaTimeMin}
        max={gtaTimeMax}
        color="green"
        className="w-full"
      />
      <div className="flex flex-row gap-6">
        <ButtonGroup variant="outlined">
          <IconButton
            variant="outlined"
            onClick={() => onGtaTimeChange(gtaTimeMin)}
          >
            <FontAwesomeIcon icon={faBackwardStep} />
          </IconButton>
          <IconButton
            variant="outlined"
            onClick={() => onIsPlayingChange(!isPlaying)}
          >
            {isPlaying ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </IconButton>
          <IconButton
            variant="outlined"
            onClick={() => onGtaTimeChange(gtaTimeMax)}
          >
            <FontAwesomeIcon icon={faForwardStep} />
          </IconButton>
        </ButtonGroup>
        <Select
          label="再生速度"
          value={playSpeedRatio.toString()}
          onChange={(val) => onPlaySpeedRatioChange(Number(val))}
          size="sm"
        >
          <Option value="1">x1 (等倍)</Option>
          <Option value="60">x60 (1秒 = 1分)</Option>
          <Option value="300">x300 (1秒 = 5分)</Option>
          <Option value="1800">x1800 (1秒 = 30分)</Option>
        </Select>
      </div>
      {/* 表示オプション */}
      <Switch
        label="ルートを表示"
        checked={showRoute}
        onChange={(ev) => onShowRouteChange(ev.target.checked)}
        color="green"
      />

      {liverSelectComponent}
    </div>
  );
}
