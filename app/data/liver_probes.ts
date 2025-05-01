"use client";
import { Liver } from "./liver";
import { Probe, ProbePoint } from "./probe";
import useSWR from "swr";

export interface LiverProbe {
    gtaDay: number; // 1 - 10
    liverId: string;
    probePath: string;
}

interface RawProbe {
    liver_id: string;
    gta_day: number; // 1 - 10
    video_start_timestamp: number; // unix timestamp
    video_url: string;//video url
    probe: ProbePoint[];
}

function filterLiverProbesByGtaDayAndLivers(liverProbes: LiverProbe[], gtaDay: number, selectedLivers: Liver[]): LiverProbe[] {
    return liverProbes.filter((probe) => (probe.gtaDay === gtaDay) && selectedLivers.some((liver) => liver.id === probe.liverId));
}

export function getProbesByGtaDayAndLivers(liverProbes: LiverProbe[], gtaDay: number, selectedLivers: Liver[]): Probe[] {
    const filteredProbes = filterLiverProbesByGtaDayAndLivers(liverProbes, gtaDay, selectedLivers);
    if (filteredProbes.length === 0) {
        return [];
    }
    const fetcher = (urls: string[]) => {
        // console.log("fetching", urls);
        return Promise.all(urls.map((url) => fetch(url)
        .then((res) => res.json())
        .then((data:RawProbe) => {
            // console.log("fetched", data);
            const probePoints = data.probe.map((point) => ({ t: point.t, x: point.x, y: point.y }));
            const liver = selectedLivers.find((liver) => liver.id === data.liver_id);
            if (!liver) {
                throw new Error(`Liver not found for id: ${data.liver_id}`);
            }
            return { liver, gtaDay: data.gta_day, probePoints };
        })));
    }
    const { data, error } = useSWR(filteredProbes.map((probe) => probe.probePath), fetcher);
    if (error) { // TODO: 失敗時の処理
        console.error("Failed to fetch probe data", error);
        return [];
    }
    // console.log("Fetched probe data", data);
    return data as Probe[];
}