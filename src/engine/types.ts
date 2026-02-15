export const BOARD_WIDTH = 12;
export const BOARD_HEIGHT = 12;

export type Direction = "N" | "E" | "S" | "W";
export type TileType = "straight" | "corner" | "tee" | "cross" | "start" | "goal";
export type Rotation = 0 | 90 | 180 | 270;

export interface Tile {
  type: TileType;
  rot: Rotation;
}

export type TileMap = Record<string, Tile>;

export interface Track {
  name: string;
  width: number;
  height: number;
  tiles: TileMap;
}

export interface Coord {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  name: string;
  color: string;
}

export type Command = "forward" | "backward" | "turnLeft" | "turnRight";

export type RobotStatus = "idle" | "moving" | "blocked" | "reachedGoal";

export interface Frame {
  x: number;
  y: number;
  dir: Direction;
  status: RobotStatus;
  stepIndex: number;
}

export interface PlayerRun {
  playerId: string;
  frames: Frame[];
  endedBecause: "commandsExhausted" | "blocked" | "reachedGoal";
}

export interface SimulationResult {
  runs: PlayerRun[];
}

export interface ValidationError {
  code:
    | "wrong_start_count"
    | "wrong_goal_count"
    | "disconnected_graph"
    | "open_connector"
    | "unreachable_goal";
  message: string;
  cells: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface PositionedTile {
  key: string;
  x: number;
  y: number;
  tile: Tile;
}
