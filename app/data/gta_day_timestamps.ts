export interface GtaDayTimestamp {
  gtaDay: number;
  startTimestamp: number;
  endTimeStamp: number;
}

export const gtaDayTimestamps: GtaDayTimestamp[] = [
  { gtaDay: 1, startTimestamp: 1718445600, endTimeStamp: 1718474400 },
  { gtaDay: 2, startTimestamp: 1718532000, endTimeStamp: 1718560800 },
  { gtaDay: 3, startTimestamp: 1718618400, endTimeStamp: 1718647200 },
  { gtaDay: 4, startTimestamp: 1718704800, endTimeStamp: 1718733600 },
  { gtaDay: 5, startTimestamp: 1718791200, endTimeStamp: 1718820000 },
  { gtaDay: 6, startTimestamp: 1718877600, endTimeStamp: 1718907300 }, // 19-27:15
  { gtaDay: 7, startTimestamp: 1718974800, endTimeStamp: 1719000000 }, // 22-29
  { gtaDay: 8, startTimestamp: 1719061200, endTimeStamp: 1719086400 }, // 22-29
  { gtaDay: 9, startTimestamp: 1719136800, endTimeStamp: 1719172800 }, // 19-29
  { gtaDay: 9.5, startTimestamp: 1719201600, endTimeStamp: 1719216000 }, // 卯月コウと北小路ヒスイの神殺し準備 13:00-17:00
  { gtaDay: 10, startTimestamp: 1719223200, endTimeStamp: 1719253800 }, // 19-27:30
];
