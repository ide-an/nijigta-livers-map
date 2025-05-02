import { Liver } from "../data/liver";
import { LiverInfo } from "./liver_info";

// ライバーカラーのborder。 globals.cssでsafelistに追加しているクラスと対応する
const toBorderColorClass = (liver: Liver) => {
  return `border-${liver.id}-500`;
};
export default function LiverList({ livers }: { livers: Liver[] }) {
  console.log("LiverList render", livers.length);
  return (
    <div className="flex flex-col gap-6 overflow-y-auto h-full hidden md:block">
      {livers.map((liver) => (
        <div key={liver.id} className="flex items-center gap-4">
        <LiverInfo liver={liver} />
        </div>
      ))}
    </div>
  );
}
