import { BOARD_HEIGHT, BOARD_WIDTH, TileMap, Track } from "../engine/types";

type StarterTrack = Track & { isStarter: true };

function makeTrack(name: string, tiles: TileMap): StarterTrack {
  return {
    name,
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    tiles,
    isStarter: true
  };
}

export const starterTracks: StarterTrack[] = [
  makeTrack("Simple Loop", {
    "3,3": { type: "corner", rot: 90 },
    "4,3": { type: "straight", rot: 0 },
    "5,3": { type: "tee", rot: 0 },
    "6,3": { type: "straight", rot: 0 },
    "7,3": { type: "tee", rot: 0 },
    "8,3": { type: "corner", rot: 180 },

    "8,4": { type: "straight", rot: 90 },
    "8,5": { type: "straight", rot: 90 },
    "8,6": { type: "tee", rot: 90 },
    "8,7": { type: "straight", rot: 90 },

    "8,8": { type: "corner", rot: 270 },
    "7,8": { type: "straight", rot: 0 },
    "6,8": { type: "tee", rot: 180 },
    "5,8": { type: "straight", rot: 0 },
    "4,8": { type: "straight", rot: 0 },
    "3,8": { type: "corner", rot: 0 },

    "3,7": { type: "straight", rot: 90 },
    "3,6": { type: "straight", rot: 90 },
    "3,5": { type: "tee", rot: 270 },
    "3,4": { type: "straight", rot: 90 },

    "5,2": { type: "start", rot: 180 },
    "6,9": { type: "start", rot: 0 },
    "2,5": { type: "start", rot: 90 },
    "9,6": { type: "start", rot: 270 },
    "7,2": { type: "goal", rot: 180 }
  }),
  makeTrack("Zig-Zag Path", {
    "1,2": { type: "start", rot: 90 },
    "2,2": { type: "straight", rot: 0 },
    "3,2": { type: "tee", rot: 0 },
    "4,2": { type: "corner", rot: 180 },

    "4,3": { type: "straight", rot: 90 },
    "4,4": { type: "corner", rot: 0 },
    "5,4": { type: "straight", rot: 0 },
    "6,4": { type: "tee", rot: 0 },
    "7,4": { type: "corner", rot: 180 },

    "7,5": { type: "straight", rot: 90 },
    "7,6": { type: "corner", rot: 0 },
    "8,6": { type: "tee", rot: 180 },
    "9,6": { type: "straight", rot: 0 },
    "10,6": { type: "goal", rot: 270 },

    "3,1": { type: "start", rot: 180 },
    "6,3": { type: "start", rot: 180 },
    "8,7": { type: "start", rot: 0 }
  }),
  makeTrack("Branching Tee Path", {
    "2,5": { type: "start", rot: 90 },
    "3,5": { type: "straight", rot: 0 },
    "4,5": { type: "tee", rot: 0 },
    "5,5": { type: "tee", rot: 180 },
    "6,5": { type: "tee", rot: 180 },
    "7,5": { type: "straight", rot: 0 },
    "8,5": { type: "start", rot: 270 },

    "4,4": { type: "straight", rot: 90 },
    "4,3": { type: "start", rot: 180 },

    "6,6": { type: "straight", rot: 90 },
    "6,7": { type: "start", rot: 0 },

    "5,6": { type: "goal", rot: 0 }
  }),
  makeTrack("Central Cross Map", {
    "5,5": { type: "cross", rot: 0 },

    "4,5": { type: "straight", rot: 0 },
    "3,5": { type: "start", rot: 90 },

    "6,5": { type: "straight", rot: 0 },
    "7,5": { type: "start", rot: 270 },

    "5,4": { type: "straight", rot: 90 },
    "5,3": { type: "start", rot: 180 },

    "5,6": { type: "tee", rot: 270 },
    "5,7": { type: "start", rot: 0 },

    "4,6": { type: "goal", rot: 90 }
  })
];

export function getStarterTracks(): StarterTrack[] {
  return starterTracks.map((track) => ({
    ...track,
    tiles: { ...track.tiles }
  }));
}
