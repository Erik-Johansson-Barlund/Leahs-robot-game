import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  Command,
  Coord,
  Direction,
  Frame,
  Player,
  SimulationResult,
  Tile,
  Track
} from "./types";
import {
  areTilesConnected,
  coordToKey,
  getConnectors,
  getOppositeDirection,
  keyToCoord,
  listPositionedTiles,
  moveCoord
} from "./tileConnectivity";

const leftTurnMap: Record<Direction, Direction> = {
  N: "W",
  W: "S",
  S: "E",
  E: "N"
};

const rightTurnMap: Record<Direction, Direction> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N"
};

function inBounds(coord: Coord, width: number, height: number): boolean {
  return coord.x >= 0 && coord.y >= 0 && coord.x < width && coord.y < height;
}

function getSortedStartTiles(track: Track): Array<{ key: string; dir: Direction }> {
  return listPositionedTiles(track.tiles)
    .filter((entry) => entry.tile.type === "start")
    .map((entry) => {
      const connectors = getConnectors(entry.tile);
      return {
        key: entry.key,
        dir: connectors[0] ?? "N"
      };
    });
}

function isGoal(tile: Tile | undefined): boolean {
  return Boolean(tile && tile.type === "goal");
}

function attemptMove(
  current: Coord,
  moveDirection: Direction,
  track: Track
): { success: boolean; next: Coord } {
  const currentKey = coordToKey(current);
  const currentTile = track.tiles[currentKey];
  if (!currentTile) {
    return { success: false, next: current };
  }

  if (!getConnectors(currentTile).includes(moveDirection)) {
    return { success: false, next: current };
  }

  const next = moveCoord(current, moveDirection);
  if (!inBounds(next, track.width, track.height)) {
    return { success: false, next: current };
  }

  const nextKey = coordToKey(next);
  const nextTile = track.tiles[nextKey];
  if (!nextTile || !areTilesConnected(currentTile, nextTile, moveDirection)) {
    return { success: false, next: current };
  }

  return { success: true, next };
}

export function simulate(
  track: Track,
  players: Player[],
  programs: Record<string, Command[]>,
  options?: { startOffset?: number }
): SimulationResult {
  const starts = getSortedStartTiles(track);
  const startOffset = options?.startOffset ?? 0;

  const runs = players.map((player, index) => {
    const shiftedStartIndex =
      starts.length > 0 ? (index + (startOffset % starts.length)) % starts.length : 0;
    const start = starts[shiftedStartIndex] ?? starts[0] ?? { key: "0,0", dir: "N" as Direction };
    const startCoord = keyToCoord(start.key);
    const commands = (programs[player.id] ?? []).slice(0, 30);

    let position = startCoord;
    let direction = start.dir;
    let endedBecause: "commandsExhausted" | "blocked" | "reachedGoal" = "commandsExhausted";

    const frames: Frame[] = [
      {
        x: position.x,
        y: position.y,
        dir: direction,
        status: "idle" as const,
        stepIndex: -1
      }
    ];

    const startTile = track.tiles[coordToKey(position)];
    if (isGoal(startTile)) {
      endedBecause = "reachedGoal";
      frames.push({
        x: position.x,
        y: position.y,
        dir: direction,
        status: "reachedGoal",
        stepIndex: 0
      });
      return { playerId: player.id, frames, endedBecause };
    }

    for (let stepIndex = 0; stepIndex < commands.length; stepIndex += 1) {
      const command = commands[stepIndex]!;

      if (command === "turnLeft") {
        direction = leftTurnMap[direction];
        frames.push({
          x: position.x,
          y: position.y,
          dir: direction,
          status: "idle",
          stepIndex
        });
        continue;
      }

      if (command === "turnRight") {
        direction = rightTurnMap[direction];
        frames.push({
          x: position.x,
          y: position.y,
          dir: direction,
          status: "idle",
          stepIndex
        });
        continue;
      }

      const moveDirection = command === "forward" ? direction : getOppositeDirection(direction);
      const moveResult = attemptMove(position, moveDirection, track);
      if (!moveResult.success) {
        endedBecause = "blocked";
        frames.push({
          x: position.x,
          y: position.y,
          dir: direction,
          status: "blocked",
          stepIndex
        });
        break;
      }

      position = moveResult.next;
      const tile = track.tiles[coordToKey(position)];
      const status = isGoal(tile) ? "reachedGoal" : "moving";

      frames.push({
        x: position.x,
        y: position.y,
        dir: direction,
        status,
        stepIndex
      });

      if (status === "reachedGoal") {
        endedBecause = "reachedGoal";
        break;
      }
    }

    return {
      playerId: player.id,
      frames,
      endedBecause
    };
  });

  return { runs };
}

export function getFrameDurationMs(): number {
  return 450;
}

export function getBoardDimensions(track: Track): { width: number; height: number } {
  return {
    width: track.width || BOARD_WIDTH,
    height: track.height || BOARD_HEIGHT
  };
}
