"use client";

import { BackwardIcon, ForwardIcon, PlayIcon } from "@heroicons/react/24/solid";
import { ButtonGroup, IconButton, Select, Slider, Option, Switch, Button, Avatar, Typography } from "@material-tailwind/react";

export default function MapControl() {
  return (
    <div className="flex flex-col gap-6 py-6 px-4">
      <div className="flex flex-row gap-6 items-center">
        <div >
          {/* 日付選択 */}
          <Select label="日付" value="1" size="sm">
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
        <div >
          <Typography variant="h3">6/14 19:23:45</Typography>
        </div>
      </div>

      {/* 再生・停止 */}
      <Slider defaultValue={50} color="green" className="w-full" />
      <div className="flex flex-row gap-6">
        <ButtonGroup variant="outlined">
          {/* TODO: 一番最初・最後に行くとわかりやすいアイコンにしたい。heroiconsにはない？*/}
          <IconButton variant="outlined">
            <BackwardIcon className="h-4 w-4" />
          </IconButton>
          <IconButton variant="outlined">
            <PlayIcon className="h-4 w-4" />
          </IconButton>
          <IconButton variant="outlined">
            <ForwardIcon className="h-4 w-4" />
          </IconButton>
        </ButtonGroup>
        <Select label="再生速度" value="1x" size="sm">
          <Option value="1x">1x</Option>
          <Option value="60x">60x</Option>
          <Option value="300x">300x</Option>
        </Select>
      </div>
      {/* 表示オプション */}
      <Switch label="ルートを表示" defaultChecked={true} color="green" />

      {/* ライバー選択 */}
      <Button variant="outlined" >ライバー選択</Button>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Avatar src="/img/avatar/test.png" />
          <div>
            <Typography variant="h6">叶</Typography>
            <Typography variant="small">手動補正済み</Typography>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar src="/img/avatar/test.png" />
          <div>
            <Typography variant="h6">叶</Typography>
            <Typography variant="small">手動補正済み</Typography>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar src="/img/avatar/test.png" />
          <div>
            <Typography variant="h6">叶</Typography>
            <Typography variant="small">手動補正済み</Typography>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar src="/img/avatar/test.png" />
          <div>
            <Typography variant="h6">叶</Typography>
            <Typography variant="small">手動補正済み</Typography>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar src="/img/avatar/test.png" />
          <div>
            <Typography variant="h6">叶</Typography>
            <Typography variant="small">手動補正済み</Typography>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar src="/img/avatar/test.png" />
          <div>
            <Typography variant="h6">叶</Typography>
            <Typography variant="small">!補正前</Typography>
          </div>
        </div>
      </div>
    </div>
  );
}