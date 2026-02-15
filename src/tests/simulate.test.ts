import { simulate } from "@/engine/simulate";
import { Command, Player, Track } from "@/engine/types";

const players: Player[] = [
  { id: "p1", name: "Ava", color: "#ef4444" },
  { id: "p2", name: "Ben", color: "#3b82f6" }
];

const baseTrack: Track = {
  name: "Test Track",
  width: 12,
  height: 12,
  tiles: {
    "0,0": { type: "start", rot: 90 },
    "1,0": { type: "straight", rot: 0 },
    "2,0": { type: "goal", rot: 270 },
    "0,2": { type: "start", rot: 90 },
    "1,2": { type: "straight", rot: 0 },
    "2,2": { type: "start", rot: 270 },
    "0,4": { type: "start", rot: 90 }
  }
};

describe("simulate", () => {
  it("moves forward and reaches goal", () => {
    const programs: Record<string, Command[]> = {
      p1: ["forward", "forward"]
    };

    const result = simulate(baseTrack, [players[0]], programs);
    const run = result.runs[0]!;

    expect(run.endedBecause).toBe("reachedGoal");
    expect(run.frames.at(-1)?.status).toBe("reachedGoal");
    expect(run.frames.at(-1)?.x).toBe(2);
    expect(run.frames.at(-1)?.y).toBe(0);
  });

  it("blocks on invalid move and stops", () => {
    const programs: Record<string, Command[]> = {
      p1: ["backward", "forward", "forward"]
    };

    const result = simulate(baseTrack, [players[0]], programs);
    const run = result.runs[0]!;

    expect(run.endedBecause).toBe("blocked");
    expect(run.frames.at(-1)?.status).toBe("blocked");
    expect(run.frames).toHaveLength(2);
  });

  it("runs players sequentially with deterministic starts", () => {
    const programs: Record<string, Command[]> = {
      p1: ["forward"],
      p2: ["forward"]
    };

    const result = simulate(baseTrack, players, programs);

    expect(result.runs).toHaveLength(2);
    expect(result.runs[0]?.playerId).toBe("p1");
    expect(result.runs[1]?.playerId).toBe("p2");
    expect(result.runs[0]?.frames[1]).toMatchObject({ x: 1, y: 0 });
    expect(result.runs[1]?.frames[1]).toMatchObject({ x: 1, y: 2 });
  });
});
