"use client";
import { Typography } from "@material-tailwind/react";
import TextLink from "../components/text_link";
export default function Page() {
  return (
    <>
      <title>注意事項 | にじGTAライバーMAP</title>
      <main className="m-4 md:mx-32 md:my-4 p-8 bg-white rounded-md">
        {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
        <Typography variant="h2" className="mb-4">
          注意事項
        </Typography>

        <ul className="list-disc pl-4">
          <li>
            GTA内でのライバー位置は基本的に動画をプログラムで解析して収集したものです。
            一部手動での修正はしていますが、
            <strong>正確性は保証できません。</strong>
            <ul className="list-disc pl-4">
              <li>
                特に山間部、海上（客船強盗、オイルリグを含む）、高速道路上では位置の誤判定、取得漏れが起きやすいです。
              </li>
              <li>
                大まかには、動画内のミニマップ表示から番地を取得して位置を推定しています。
              </li>
              <li>
                解析の詳細は
                <TextLink href="https://github.com/ide-an/nijigta-livers-map/blob/main/doc/technical_detail.md">
                  技術的な話
                </TextLink>
                をご参照ください。
              </li>
            </ul>
          </li>
          <li>
            成瀬鳴（2024年8月31日卒業）はアーカイブを取得できなかったため、対応していません。
          </li>
          <li>
            自枠での配信がないケースには対応していません（DAY 1のSMC組、DAY
            6の天ヶ瀬むゆなど）。{" "}
          </li>
        </ul>
      </main>
    </>
  );
}
