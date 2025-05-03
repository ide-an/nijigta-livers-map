import { Liver } from "./liver";

export interface ProbePoint {
  t: number; // unix timestamp
  x: number; // x座標
  y: number; // y座標
}

export interface Probe {
  liver: Liver;
  gtaDay: number; // 1 - 10
  probePoints: ProbePoint[];
  videoUrl: string; // video url
  videoStartTimestamp: number; // unix timestamp
}
