import { useMutation, useQuery } from "convex/react";
import { Track, TileMap } from "@/engine/types";
import { getStarterTracks } from "@/lib/starterTracks";
import { TrackDoc } from "./schema";
export type { TrackDoc } from "./schema";

export const api = {
  tracks: {
    createTrack: "tracks:createTrack",
    listTracks: "tracks:listTracks",
    getTrack: "tracks:getTrack"
  },
  seed: {
    seedStarterTracks: "seed:seedStarterTracks"
  }
} as const;

export function useConvexTrackList(): TrackDoc[] | undefined {
  return useQuery(api.tracks.listTracks as any, {}) as TrackDoc[] | undefined;
}

export function useConvexCreateTrack() {
  return useMutation(api.tracks.createTrack as any);
}

export function getLocalStarterTracks(): TrackDoc[] {
  return getStarterTracks().map((track) => ({
    ...track,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    _id: `starter-${track.name.toLowerCase().replace(/\s+/g, "-")}`
  }));
}

export interface CreateTrackInput {
  name: string;
  width: number;
  height: number;
  tiles: TileMap;
}

export function toTrack(trackDoc: TrackDoc): Track {
  return {
    name: trackDoc.name,
    width: trackDoc.width,
    height: trackDoc.height,
    tiles: trackDoc.tiles
  };
}
