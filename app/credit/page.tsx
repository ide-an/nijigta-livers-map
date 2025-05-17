"use client";
import { Typography } from "@material-tailwind/react";
import { NavbarDefault } from "../components/navbar";
import TextLink from "../components/text_link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faSquareGithub,
  faSquareXTwitter,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import liverVideos from "../data/liver_videos.json";
import { Fragment } from "react";

export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      <div className="h-[63.5px] md:h-[63.5px]">
        <NavbarDefault />
      </div>
      <div className="h-[calc(100vh-63.5px)] md:h-[calc(100vh-63.5px)] bg-gray-200  overflow-y-scroll">
        <main className="m-4 md:mx-32 md:my-4 p-8 bg-white rounded-md">
          <Typography variant="h2" className="mb-4">
            Credit
          </Typography>

          <Typography variant="h5" className="my-4">
            開発・運用
          </Typography>
          <p>
            @ide_an{" "}
            <a href="https://x.com/ide_an" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faSquareXTwitter} size="xl" />
            </a>{" "}
            <a
              href="https://github.com/ide-an"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faSquareGithub} size="xl" />
            </a>
          </p>
          <Typography variant="h5" className="my-4">
            素材、参照情報など
          </Typography>
          <ul className="list-disc pl-4">
            <li>
              地図画像:{" "}
              <TextLink href="https://forum.cfx.re/t/release-postal-code-map-minimap-new-improved-v1-3/147458">
                [Release] Postal Code Map & Minimap - New & Improved - v1.3
              </TextLink>{" "}
              を元に改変
            </li>
            <li>
              ライバー画像:{" "}
              <TextLink href="https://www.nijisanji.jp/talents">
                タレント一覧 | にじさんじ
              </TextLink>{" "}
              Hex Haywireのみ
              <TextLink href="https://wikiwiki.jp/nijisanji/Hex%20Haywire">
                にじさんじ非公式Wiki
              </TextLink>
              から取得（卒業のため）
            </li>
            <li>
              GTA内の職業、イベント参加情報など:{" "}
              <TextLink href="https://wikiwiki.jp/nijisanji/Grand%20Theft%20Auto%E3%81%BE%E3%81%A8%E3%82%81/GTA5/%E3%81%AB%E3%81%98%E3%81%95%E3%82%93%E3%81%98GTA">
                にじさんじGTAサーバーまとめ | にじさんじ非公式Wiki
              </TextLink>
              を元に改変（組織の構成員として協力者を含めるかなど調整）
            </li>
          </ul>
          <Typography variant="h5" className="my-4">
            元動画一覧
          </Typography>
          {liverVideos.map((entry) => {
            return (
              <Fragment key={entry.liver + "-frag"}>
                <Typography variant="h6">{entry.liver}</Typography>
                <ul className="list-disc pl-4">
                  {entry.videos.map((video) => {
                    return (
                      <li key={video}>
                        <TextLink href={video}>{video}</TextLink>
                      </li>
                    );
                  })}
                </ul>
              </Fragment>
            );
          })}
        </main>
      </div>
    </div>
  );
}
