import { Typography } from "@material-tailwind/react";
import { Liver } from "../data/liver";
import { LiverInfo } from "./liver_info";

export default function LiverList({ livers }: { livers: Liver[] }) {
  console.log("LiverList render", livers.length);
  return (
    <>
      {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
      <Typography variant="h6" className="text-gray-700 hidden md:block">
        選択中のライバー
      </Typography>
      <div className="flex flex-col gap-6 overflow-y-auto h-full hidden md:block">
        {livers.map((liver) => (
          <div key={liver.id} className="flex items-center gap-4">
            <LiverInfo liver={liver} />
          </div>
        ))}
      </div>
    </>
  );
}
