import {
  Button,
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
import { Virtuoso } from "react-virtuoso";
import { LiverInfo } from "./liver_info";

function removeDuplicates(array: Liver[]): Liver[] {
  const uniqueIds = new Set(array.map((item) => item.id));
  return Array.from(uniqueIds).map((id) => {
    return array.find((item) => item.id === id);
  }) as Liver[];
}

export default function LiverSelectDialog({
  selectedLivers,
  onSelectedLiversChange,
}: {
  selectedLivers: Liver[];
  onSelectedLiversChange: (livers: Liver[]) => void;
}) {
  //   console.time("LiverSelectDialog render");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
  //   console.timeLog("LiverSelectDialog render", "open", open);
  const filteredLivers = livers.filter((liver) => {
    const lowerQuery = query.toLowerCase();
    return (
      query === "" ||
      liver.name.toLowerCase().includes(query) ||
      liver.enName.toLowerCase().includes(query) ||
      liver.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });
  const handleAddLiver = (liver: Liver) => {
    onSelectedLiversChange(removeDuplicates([...selectedLivers, liver]));
  };
  const handleAddAll = () => {
    onSelectedLiversChange(
      removeDuplicates([...selectedLivers, ...filteredLivers])
    );
  };
  const handleRemoveLiver = (liver: Liver) => {
    onSelectedLiversChange(
      selectedLivers.filter((selectedLiver) => selectedLiver.id !== liver.id)
    );
  };
  const handleRemoveAll = () => {
    onSelectedLiversChange([]);
  };

  //   console.timeEnd("LiverSelectDialog render");

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
          <div className="flex flex-col md:flex-row gap-6">
            {/* ライバーの検索 */}
            <div className="flex-1">
              <div className="p-1">
                <Input
                  label="ライバー名、ジョブなどで検索"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="p-2">
                <Button size="sm" color="green" onClick={handleAddAll}>
                  全選択
                </Button>
              </div>
              <div className="overflow-y-auto md:h-96 h-48 border pl-2">
                <Virtuoso
                  data={filteredLivers}
                  itemContent={(_, liver) => (
                    <div key={liver.id} className="flex items-center gap-4">
                      <div className="flex-none">
                        {/* TODO: 選択済みならdsabledにする */}
                        <Button
                          size="sm"
                          variant="outlined"
                          color="green"
                          onClick={() => handleAddLiver(liver)}
                        >
                          選択
                        </Button>
                      </div>
                      <LiverInfo liver={liver} />
                    </div>
                  )}
                />
              </div>
            </div>
            {/* 選択済みのライバー一覧 */}
            <div className="flex-1">
              <Typography variant="h5" className="mb-4">
                選択中のライバー
              </Typography>
              {/* 左右で位置を揃えるためのpt */}
              <div className="p-2 md:pt-3">
                <Button size="sm" color="red" onClick={handleRemoveAll}>
                  全解除
                </Button>
              </div>
              <div className="overflow-y-auto md:h-96 h-48 border pl-2">
                <Virtuoso
                  data={selectedLivers}
                  itemContent={(_, liver) => (
                    <div key={liver.id} className="flex items-center gap-4">
                      <div className="flex-none">
                        <Button
                          size="sm"
                          variant="outlined"
                          color="red"
                          onClick={() => handleRemoveLiver(liver)}
                        >
                          解除
                        </Button>
                      </div>
                      <LiverInfo liver={liver} />
                    </div>
                  )}
                />
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
