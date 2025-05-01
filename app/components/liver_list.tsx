import { Virtuoso } from "react-virtuoso";
import { Liver } from "../data/liver";
import { Avatar, Chip, Typography } from "@material-tailwind/react";

// ライバーカラーのborder。 globals.cssでsafelistに追加しているクラスと対応する
const toBorderColorClass = (liver: Liver) => {
  return `border-${liver.id}-500`;
};
export default function LiverList({ livers }: { livers: Liver[] }) {
  console.log("LiverList render", livers.length);
  return (
    <div className="flex flex-col gap-6 overflow-y-auto h-full">
      <Virtuoso
        data={livers}
        itemContent={(index, liver) => (
          <div key={liver.id} className="flex items-center gap-4">
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
        )}
        style={{ height: "100%" }}
      />
    </div>
  );
}
