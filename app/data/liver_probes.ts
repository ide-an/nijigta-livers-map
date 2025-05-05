"use client";
import { Liver } from "./liver";
import { Probe, ProbePoint } from "./probe";
import livers from "./livers.json";
// import useSWR from "swr";

export interface LiverProbe {
  gtaDay: number; // 1 - 10
  liverId: string;
  probePath: string;
}

interface RawProbe {
  liver_id: string;
  gta_day: number; // 1 - 10
  video_start_timestamp: number; // unix timestamp
  video_url: string; //video url
  probe: RawProbePoint[];
}

interface RawProbePoint {
  t: number; // unix timestamp
  x: number; // x座標
  y: number; // y座標
  vt: number; // 動画のtimestamp。動画開始からの秒数
}

export function filterLiverProbesByGtaDayAndLivers(
  liverProbes: LiverProbe[],
  gtaDay: number,
  selectedLivers: Liver[]
): LiverProbe[] {
  return liverProbes.filter(
    (probe) =>
      probe.gtaDay === gtaDay &&
      selectedLivers.some((liver) => liver.id === probe.liverId)
  );
}

export function getProbesFetcher(urls: string[]): Promise<Probe[]> {
  // console.log("fetching", urls);
  return Promise.all(
    urls.map((url) =>
      fetch(url)
        .then((res) => res.json())
        .then((data: RawProbe) => {
          // console.log("fetched", data);
          const probePoints = data.probe.map((point) => ({
            t: point.t,
            x: point.x,
            y: point.y,
            vt: point.vt,
          }));
          const liver = livers.find((liver) => liver.id === data.liver_id);
          if (!liver) {
            throw new Error(`Liver not found for id: ${data.liver_id}`);
          }
          return {
            liver,
            gtaDay: data.gta_day,
            probePoints,
            videoUrl: data.video_url,
            videoStartTimestamp: data.video_start_timestamp,
          };
        })
    )
  );
}
