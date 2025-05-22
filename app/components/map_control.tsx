"use client";

import {
  ButtonGroup,
  IconButton,
  Select,
  Option,
  Switch,
  Typography,
  Button,
} from "@material-tailwind/react";
import { formatInTimeZone } from "date-fns-tz";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faCopy,
  faForwardStep,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

export default function MapControl({
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
  shareUrl,
}: {
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
  shareUrl: string;
}) {
  // console.time("MapControl render");
  const gtaDate = new Date(gtaTime * 1000);
  const gtaDateString = formatInTimeZone(gtaDate, "Asia/Tokyo", "M/d HH:mm:ss");

  const copyClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      console.log("copyClipboard failed:", error);
    }
  };
  // console.timeEnd("MapControl render");
  return (
    <div className="flex flex-col gap-6 py-6 px-4 overflow-y-hidden md:max-h-full h-full">
      <div className="flex flex-row gap-6 items-center">
        <div>
          {/* 日付選択 */}
          {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
          <Select
            label="日付"
            value={gtaDay.toString()}
            onChange={(val) => onGtaDayChange(Number(val))}
            size="md"
            menuProps={{ className: "max-h-48 md:max-h-none" }}
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
          {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
          <Typography variant="h5" className="block md:hidden">
            {gtaDateString}
          </Typography>
          {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
          <Typography variant="h3" className="hidden md:block">
            {gtaDateString}
          </Typography>
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
        {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
        <ButtonGroup variant="outlined">
          {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
          <IconButton
            variant="outlined"
            onClick={() => onGtaTimeChange(gtaTimeMin)}
          >
            <FontAwesomeIcon icon={faBackwardStep} />
          </IconButton>
          {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
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
          {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
          <IconButton
            variant="outlined"
            onClick={() => onGtaTimeChange(gtaTimeMax)}
          >
            <FontAwesomeIcon icon={faForwardStep} />
          </IconButton>
        </ButtonGroup>
        {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
        <Select
          label="再生速度"
          value={playSpeedRatio.toString()}
          onChange={(val) => onPlaySpeedRatioChange(Number(val))}
          size="md"
          menuProps={{ className: "max-h-32 md:max-h-none" }}
        >
          <Option value="1">x1 (等倍)</Option>
          <Option value="10">x60 (1秒 = 10秒)</Option>
          <Option value="60">x60 (1秒 = 1分)</Option>
          <Option value="300">x300 (1秒 = 5分)</Option>
          <Option value="1800">x1800 (1秒 = 30分)</Option>
        </Select>
      </div>
      <div className="flex flex-row gap-6 justify-between">
        {/* 表示オプション */}
        {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
        <Switch
          label="ルートを表示"
          checked={showRoute}
          onChange={(ev) => onShowRouteChange(ev.target.checked)}
          color="green"
        />
        {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
        <Button
          variant="outlined"
          className="flex item-center gap-3"
          onClick={copyClipboard}
        >
          <FontAwesomeIcon icon={faCopy} size="lg" />
          この時刻のURLをコピー
        </Button>
      </div>
      {liverSelectComponent}
    </div>
  );
}
