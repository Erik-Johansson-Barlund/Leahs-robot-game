import { coordToKey } from "@/engine/tileConnectivity";
import { Direction, Tile as TileModel, TileMap } from "@/engine/types";
import { Tile } from "./Tile";
import { RobotToken } from "./RobotToken";

interface BoardRobot {
  x: number;
  y: number;
  name: string;
  color: string;
  dir: Direction;
}

interface BoardProps {
  width: number;
  height: number;
  tiles: TileMap;
  highlightCells?: string[];
  robots?: BoardRobot[];
  onTileClick?: (key: string, tile: TileModel) => void;
}

export function Board({
  width,
  height,
  tiles,
  highlightCells = [],
  robots = [],
  onTileClick
}: BoardProps) {
  const highlights = new Set(highlightCells);

  return (
    <div
      className="grid gap-1 rounded-3xl bg-blue-200/60 p-3 shadow-xl"
      style={{
        gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`
      }}
    >
      {Array.from({ length: width * height }).map((_, idx) => {
        const x = idx % width;
        const y = Math.floor(idx / width);
        const key = coordToKey({ x, y });
        const tile = tiles[key];
        const robot = robots.find((item) => item.x === x && item.y === y);

        return (
          <div
            key={key}
            className="relative aspect-square rounded-2xl border border-white/70 bg-white/50 p-0.5"
          >
            {tile ? (
              <Tile
                tile={tile}
                highlighted={highlights.has(key)}
                onClick={onTileClick ? () => onTileClick(key, tile) : undefined}
              />
            ) : (
              <div
                className={`h-full w-full rounded-xl ${highlights.has(key) ? "bg-red-200" : "bg-white/60"}`}
              />
            )}
            {robot ? <RobotToken name={robot.name} color={robot.color} dir={robot.dir} /> : null}
          </div>
        );
      })}
    </div>
  );
}
