"use client";

import {
  BackwardIcon,
  ForwardIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/24/solid";
import {
  ButtonGroup,
  IconButton,
  Select,
  Slider,
  Option,
  Switch,
  Button,
  Avatar,
  Typography,
  Chip,
} from "@material-tailwind/react";
import { Liver } from "../data/liver";
import { formatInTimeZone } from "date-fns-tz";

export default function MapControl({
  selectedLivers,
  gtaDay,
  gtaTime,
  gtaTimeMin,
  gtaTimeMax,
  isPlaying,
  showRoute,
  playSpeedRatio,
  onSelectedLiversChange,
  onGtaDayChange,
  onGtaTimeChange,
  onShowRouteChange,
  onPlaySpeedRatioChange,
}: {
  selectedLivers: Liver[];
  gtaDay: number; // 1 - 10
  gtaTime: number; // unix timestamp
  gtaTimeMin: number; // unix timestamp
  gtaTimeMax: number; // unix timestamp
  isPlaying: boolean;
  showRoute: boolean;
  playSpeedRatio: number; // 何倍速か
  onSelectedLiversChange: (livers: Liver[]) => void;
  onGtaDayChange: (day: number) => void;
  onGtaTimeChange: (time: number) => void;
  onIsPlayingChange: (isPlaying: boolean) => void;
  onShowRouteChange: (show: boolean) => void;
  onPlaySpeedRatioChange: (ratio: number) => void;
}) {
  // ライバーカラーのborder。 globals.cssでsafelistに追加しているクラスと対応する
  const toBorderColorClass = (liver: any) => {
    return `border-${liver.id}-500`;
  };

  const gtaDate = new Date(gtaTime * 1000);
  const gtaDateString = formatInTimeZone(
    gtaDate,
    "Asia/Tokyo",
    "MM/dd HH:mm:ss"
  );

  return (
    <div className="flex flex-col gap-6 py-6 px-4 overflow-y-hidden md:max-h-screen">
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
            <Option value="10">Day 10(6/24)</Option>
          </Select>
        </div>

        {/* 時刻表示 */}
        <div>
          <Typography variant="h3">{gtaDateString}</Typography>
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
          {/* TODO: 一番最初・最後に行くとわかりやすいアイコンにしたい。heroiconsにはない？*/}
          <IconButton variant="outlined">
            {/* TODO: 頭出しの実装 */}
            <BackwardIcon className="h-4 w-4" />
          </IconButton>
          <IconButton variant="outlined">
            {isPlaying ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
          </IconButton>
          <IconButton variant="outlined">
            {/* TODO: 最後へスキップの実装 */}
            <ForwardIcon className="h-4 w-4" />
          </IconButton>
        </ButtonGroup>
        <Select
          label="再生速度"
          value={playSpeedRatio.toString()}
          onChange={(val) => onPlaySpeedRatioChange(Number(val))}
          size="sm"
        >
          <Option value="1">1x</Option>
          <Option value="60">60x</Option>
          <Option value="300">300x</Option>
        </Select>
      </div>
      {/* 表示オプション */}
      <Switch
        label="ルートを表示"
        checked={showRoute}
        onChange={(ev) => onShowRouteChange(ev.target.checked)}
        color="green"
      />

      {/* ライバー選択 */}
      <div className="w-full">
        <Button variant="outlined" fullWidth>
          ライバー選択
        </Button>
      </div>
      <div className="flex flex-col gap-6 overflow-y-auto">
        {selectedLivers.map((liver) => (
          <div key={liver.name} className="flex items-center gap-4">
            <Avatar
              src={liver.imageUrl}
              className={`border-2 ${toBorderColorClass(liver)}`}
            />
            <div>
              <Typography variant="h6">{liver.name}</Typography>
              <div className="flex flex-wrap gap-2">
                {liver.tags.map((tag, index) => (
                  <Chip value={tag} key={liver.name + "_" + tag} size="sm" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
