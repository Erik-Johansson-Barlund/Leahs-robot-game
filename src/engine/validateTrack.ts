import { BOARD_HEIGHT, BOARD_WIDTH, TileMap, ValidationError, ValidationResult } from "./types";
import {
  getConnectedNeighborKeys,
  keyToCoord,
  listOpenConnectors,
  listPositionedTiles
} from "./tileConnectivity";

function uniqueCells(cells: string[]): string[] {
  return Array.from(new Set(cells)).sort((a, b) => {
    const ac = keyToCoord(a);
    const bc = keyToCoord(b);
    return ac.y - bc.y || ac.x - bc.x;
  });
}

function bfs(startKey: string, tiles: TileMap, width: number, height: number): Set<string> {
  const visited = new Set<string>();
  const queue = [startKey];

  while (queue.length > 0) {
    const key = queue.shift()!;
    if (visited.has(key)) {
      continue;
    }

    visited.add(key);
    const neighbors = getConnectedNeighborKeys(key, tiles, width, height);
    neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    });
  }

  return visited;
}

export function validateTrack(
  tiles: TileMap,
  width = BOARD_WIDTH,
  height = BOARD_HEIGHT
): ValidationResult {
  const errors: ValidationError[] = [];
  const positioned = listPositionedTiles(tiles);

  const starts = positioned.filter((entry) => entry.tile.type === "start");
  const goals = positioned.filter((entry) => entry.tile.type === "goal");

  if (starts.length < 1 || starts.length > 4) {
    errors.push({
      code: "wrong_start_count",
      message: `We need between 1 and 4 starting pads, but found ${starts.length}.`,
      cells: starts.map((start) => start.key)
    });
  }

  if (goals.length !== 1) {
    errors.push({
      code: "wrong_goal_count",
      message: `There must be exactly 1 goal tile, but found ${goals.length}.`,
      cells: goals.map((goal) => goal.key)
    });
  }

  if (positioned.length > 0) {
    const first = positioned[0]!.key;
    const connected = bfs(first, tiles, width, height);
    if (connected.size !== positioned.length) {
      const disconnected = positioned
        .map((entry) => entry.key)
        .filter((key) => !connected.has(key));

      errors.push({
        code: "disconnected_graph",
        message: "All track tiles must be connected into one network.",
        cells: uniqueCells(disconnected)
      });
    }
  }

  const openConnectorCells: string[] = [];
  positioned.forEach((entry) => {
    const openings = listOpenConnectors(entry.key, tiles, width, height);
    if (openings.length > 0) {
      openConnectorCells.push(entry.key);
      openings.forEach((opening) => {
        if (opening.neighborKey) {
          openConnectorCells.push(opening.neighborKey);
        }
      });
    }
  });

  if (openConnectorCells.length > 0) {
    errors.push({
      code: "open_connector",
      message: "Some track ends are dangling. Connect every open path to a matching tile.",
      cells: uniqueCells(openConnectorCells)
    });
  }

  if (goals.length === 1 && starts.length > 0) {
    const goalKey = goals[0]!.key;
    const unreachableStarts = starts
      .map((start) => start.key)
      .filter((startKey) => !bfs(startKey, tiles, width, height).has(goalKey));

    if (unreachableStarts.length > 0) {
      errors.push({
        code: "unreachable_goal",
        message: "Each start tile needs a clear path to the goal.",
        cells: uniqueCells([...unreachableStarts, goalKey])
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
