import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  Coord,
  Direction,
  PositionedTile,
  Tile,
  TileMap,
  TileType
} from "./types";

const DIRS: Direction[] = ["N", "E", "S", "W"];

const directionVectors: Record<Direction, { dx: number; dy: number }> = {
  N: { dx: 0, dy: -1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: 1 },
  W: { dx: -1, dy: 0 }
};

const oppositeDirection: Record<Direction, Direction> = {
  N: "S",
  E: "W",
  S: "N",
  W: "E"
};

const baseConnectors: Record<TileType, Direction[]> = {
  straight: ["E", "W"],
  corner: ["N", "E"],
  tee: ["N", "E", "W"],
  cross: ["N", "E", "S", "W"],
  start: ["N"],
  goal: ["N"]
};

export function coordToKey(coord: Coord): string {
  return `${coord.x},${coord.y}`;
}

export function keyToCoord(key: string): Coord {
  const [x, y] = key.split(",").map(Number);
  return { x, y };
}

export function listPositionedTiles(tiles: TileMap): PositionedTile[] {
  return Object.entries(tiles)
    .map(([key, tile]) => {
      const { x, y } = keyToCoord(key);
      return { key, x, y, tile };
    })
    .sort((a, b) => (a.y - b.y) || (a.x - b.x));
}

export function rotateDirection(direction: Direction, degrees: Tile["rot"]): Direction {
  const steps = degrees / 90;
  const index = DIRS.indexOf(direction);
  return DIRS[(index + steps) % DIRS.length];
}

export function getConnectors(tile: Tile): Direction[] {
  return baseConnectors[tile.type].map((dir) => rotateDirection(dir, tile.rot));
}

export function moveCoord(coord: Coord, direction: Direction): Coord {
  const vector = directionVectors[direction];
  return {
    x: coord.x + vector.dx,
    y: coord.y + vector.dy
  };
}

export function isWithinBounds(coord: Coord, width = BOARD_WIDTH, height = BOARD_HEIGHT): boolean {
  return coord.x >= 0 && coord.y >= 0 && coord.x < width && coord.y < height;
}

export function getNeighborKey(key: string, direction: Direction): string {
  return coordToKey(moveCoord(keyToCoord(key), direction));
}

export function getOppositeDirection(direction: Direction): Direction {
  return oppositeDirection[direction];
}

export function tileHasConnector(tile: Tile, direction: Direction): boolean {
  return getConnectors(tile).includes(direction);
}

export function areTilesConnected(
  tileA: Tile,
  tileB: Tile,
  directionFromA: Direction
): boolean {
  return (
    tileHasConnector(tileA, directionFromA) &&
    tileHasConnector(tileB, getOppositeDirection(directionFromA))
  );
}

export function getConnectedNeighborKeys(
  key: string,
  tiles: TileMap,
  width = BOARD_WIDTH,
  height = BOARD_HEIGHT
): string[] {
  const currentTile = tiles[key];
  if (!currentTile) {
    return [];
  }

  return getConnectors(currentTile)
    .map((direction) => {
      const neighborKey = getNeighborKey(key, direction);
      const neighborCoord = keyToCoord(neighborKey);
      if (!isWithinBounds(neighborCoord, width, height)) {
        return null;
      }

      const neighborTile = tiles[neighborKey];
      if (!neighborTile) {
        return null;
      }

      return areTilesConnected(currentTile, neighborTile, direction) ? neighborKey : null;
    })
    .filter((value): value is string => Boolean(value));
}

export function listOpenConnectors(
  key: string,
  tiles: TileMap,
  width = BOARD_WIDTH,
  height = BOARD_HEIGHT
): Array<{ direction: Direction; neighborKey: string | null }> {
  const tile = tiles[key];
  if (!tile) {
    return [];
  }

  return getConnectors(tile)
    .map((direction) => {
      const neighborKey = getNeighborKey(key, direction);
      const neighborCoord = keyToCoord(neighborKey);
      if (!isWithinBounds(neighborCoord, width, height)) {
        return { direction, neighborKey: null };
      }

      const neighbor = tiles[neighborKey];
      if (!neighbor || !areTilesConnected(tile, neighbor, direction)) {
        return { direction, neighborKey };
      }

      return null;
    })
    .filter(
      (entry): entry is { direction: Direction; neighborKey: string | null } =>
        Boolean(entry)
    );
}
