import { Avatar, Chip, Typography } from "@material-tailwind/react";
import { Liver } from "../data/liver";
import nextConfig from "@/next.config";

const BASEPATH = nextConfig.basePath || "";
// ライバーカラーのborder。 globals.cssでsafelistに追加しているクラスと対応する
const toBorderColorClass = (liver: Liver) => {
  return `border-${liver.id}-500`;
};

export function LiverInfo({ liver }: { liver: Liver }) {
  return (
    <>
      {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
      <Avatar
        src={BASEPATH + liver.imageUrl}
        className={`border-2 ${toBorderColorClass(liver)} flex-none`}
      />
      <div className="grow">
        {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
        <Typography variant="h6">{liver.name}</Typography>
        <div className="flex flex-wrap gap-2">
          {liver.tags.map((tag) => (
            <Chip value={tag} key={liver.name + "_" + tag} size="sm" />
          ))}
        </div>
      </div>
    </>
  );
}
