import {
    Avatar,
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { Liver } from "../data/liver";
import livers from "../data/livers.json";

// ライバーカラーのborder。 globals.cssでsafelistに追加しているクラスと対応する
const toBorderColorClass = (liver: Liver) => {
  return `border-${liver.id}-500`;
};

export default function LiverSelectDialog({
  selectedLivers,
  onSelectedLiversChange,
}: {
  selectedLivers: Liver[];
  onSelectedLiversChange: (livers: Liver[]) => void;
}) {
    console.time("LiverSelectDialog render");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
console.timeLog("LiverSelectDialog render", "open", open);
  const filteredLivers = livers.filter((liver) => {
    if (query === "") return true;
    if (liver.name.includes(query)) return true;
    if (liver.tags.some((tag) => tag.includes(query))) return true;
    return false;
  });
  console.timeEnd("LiverSelectDialog render");

  return (
    <>
      {/* ライバー選択 */}
      <div className="w-full">
        <Button variant="outlined" fullWidth onClick={handleOpen}>
          ライバー選択
        </Button>
      </div>

      <Dialog open={open} handler={handleOpen} size="lg">
        <DialogHeader>ライバーを選択</DialogHeader>
        <DialogBody>
          <div className="flex flex-row gap-6">
            {/* ライバーの検索 */}
            <div className="flex-1">
              <div className="p-1">
                <Input
                  label="ライバー名、ジョブなどで検索"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button size="sm" color="green">
                全選択
              </Button>
              <div className="overflow-y-auto h-96">
                {filteredLivers.map((liver) => (
                  <div key={liver.id} className="flex items-center gap-4">
                    <div className="flex-none">
                      <Button size="sm" variant="outlined" color="green">
                        選択
                      </Button>
                    </div>
                    <Avatar
                      src={liver.imageUrl}
                      className={`border-2 ${toBorderColorClass(
                        liver
                      )} flex-none`}
                    />
                    <div className="grow">
                      <Typography variant="h6">{liver.name}</Typography>
                      <div className="flex flex-wrap gap-2">
                        {liver.tags.map((tag, index) => (
                          <Chip
                            value={tag}
                            key={liver.name + "_" + tag}
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* 選択済みのライバー一覧 */}
            <div className="flex-1">
              <Typography variant="h5" className="mb-4">
                選択中のライバー
              </Typography>
              <Button size="sm" color="red">
                全解除
              </Button>
              <div className="overflow-y-auto h-96">
                {selectedLivers.map((liver) => (
                  <div key={liver.id} className="flex items-center gap-4">
                    <div className="flex-none">
                      <Button size="sm" variant="outlined" color="red">
                        解除
                      </Button>
                    </div>
                    <Avatar
                      src={liver.imageUrl}
                      className={`border-2 ${toBorderColorClass(
                        liver
                      )} flex-none`}
                    />
                    <div className="grow">
                      <Typography variant="h6">{liver.name}</Typography>
                      <div className="flex flex-wrap gap-2">
                        {liver.tags.map((tag, index) => (
                          <Chip
                            value={tag}
                            key={liver.name + "_" + tag}
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>完了</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
