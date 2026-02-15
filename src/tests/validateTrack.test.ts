import { validateTrack } from "@/engine/validateTrack";
import { TileMap } from "@/engine/types";

const validTrackTiles: TileMap = {
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
};

describe("validateTrack", () => {
  it("accepts a fully valid track", () => {
    const result = validateTrack(validTrackTiles, 12, 12);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("detects dangling connectors", () => {
    const broken: TileMap = {
      ...validTrackTiles,
      "3,5": { type: "corner", rot: 0 }
    };

    const result = validateTrack(broken, 12, 12);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((error) => error.code === "open_connector")).toBe(true);
  });

  it("detects disconnected graph", () => {
    const disconnected: TileMap = {
      ...validTrackTiles,
      "10,10": { type: "cross", rot: 0 }
    };

    const result = validateTrack(disconnected, 12, 12);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((error) => error.code === "disconnected_graph")).toBe(true);
  });

  it("detects starts that cannot reach the goal", () => {
    const unreachable: TileMap = {
      ...validTrackTiles,
      "4,5": { type: "tee", rot: 180 }
    };

    const result = validateTrack(unreachable, 12, 12);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((error) => error.code === "unreachable_goal")).toBe(true);
  });
});
