import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { coordToKey } from "@/engine/tileConnectivity";
import { Direction, Tile as TileModel, TileMap } from "@/engine/types";
import { Tile } from "./Tile";
import { RobotToken } from "./RobotToken";

interface BoardRobot {
  id?: string;
  x: number;
  y: number;
  name: string;
  color: string;
  dir: Direction;
  robotImage?: string;
}

interface BoardProps {
  width: number;
  height: number;
  tiles: TileMap;
  highlightCells?: string[];
  robots?: BoardRobot[];
  onTileClick?: (key: string, tile: TileModel) => void;
  showRobotDirection?: boolean;
  animateRobots?: boolean;
  robotTransitionMs?: number;
  tileVariant?: "classic" | "road";
}

export function Board({
  width,
  height,
  tiles,
  highlightCells = [],
  robots = [],
  onTileClick,
  showRobotDirection = true,
  animateRobots = false,
  robotTransitionMs = 450,
  tileVariant = "classic"
}: BoardProps) {
  const highlights = new Set(highlightCells);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const cellRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastAnimatedIdentity = useRef<string | null>(null);
  const [animatedRect, setAnimatedRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [shouldAnimatePosition, setShouldAnimatePosition] = useState(false);

  const animatedRobot = animateRobots && robots.length === 1 ? robots[0] : null;
  const animatedIdentity = animatedRobot ? (animatedRobot.id ?? animatedRobot.name) : null;

  useLayoutEffect(() => {
    if (!animatedRobot) {
      setAnimatedRect(null);
      setShouldAnimatePosition(false);
      lastAnimatedIdentity.current = null;
      return;
    }

    const boardElement = boardRef.current;
    const key = coordToKey({ x: animatedRobot.x, y: animatedRobot.y });
    const cellElement = cellRefs.current[key];
    if (!boardElement || !cellElement) {
      return;
    }

    const boardRect = boardElement.getBoundingClientRect();
    const cellRect = cellElement.getBoundingClientRect();
    const sameRobot = lastAnimatedIdentity.current === animatedIdentity;

    setShouldAnimatePosition(sameRobot);
    setAnimatedRect({
      left: cellRect.left - boardRect.left,
      top: cellRect.top - boardRect.top,
      width: cellRect.width,
      height: cellRect.height
    });

    lastAnimatedIdentity.current = animatedIdentity;
  }, [animatedIdentity, animatedRobot]);

  useEffect(() => {
    if (!animatedRobot) {
      return;
    }

    const onResize = () => {
      const boardElement = boardRef.current;
      const key = coordToKey({ x: animatedRobot.x, y: animatedRobot.y });
      const cellElement = cellRefs.current[key];
      if (!boardElement || !cellElement) {
        return;
      }

      const boardRect = boardElement.getBoundingClientRect();
      const cellRect = cellElement.getBoundingClientRect();
      setAnimatedRect({
        left: cellRect.left - boardRect.left,
        top: cellRect.top - boardRect.top,
        width: cellRect.width,
        height: cellRect.height
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [animatedRobot]);

  return (
    <div
      ref={boardRef}
      className="relative grid gap-1 rounded-3xl bg-blue-200/60 p-3 shadow-xl"
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
            ref={(node) => {
              cellRefs.current[key] = node;
            }}
            className={`relative aspect-square rounded-2xl border border-white/70 bg-white/50 ${
              tileVariant === "road" ? "p-0" : "p-0.5"
            }`}
          >
            {tile ? (
              <Tile
                tile={tile}
                variant={tileVariant}
                highlighted={highlights.has(key)}
                onClick={onTileClick ? () => onTileClick(key, tile) : undefined}
              />
            ) : (
              <div
                className={`h-full w-full rounded-xl ${highlights.has(key) ? "bg-red-200" : "bg-white/60"}`}
              />
            )}
            {tileVariant === "road" && tile?.type === "goal" ? (
              <span className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-visible">
                <span className="text-7xl leading-none animate-bob filter brightness-125 saturate-160 drop-shadow-[0_0_14px_rgba(250,204,21,0.95)]">
                  👑
                </span>
              </span>
            ) : null}
            {!animatedRobot && robot ? (
              <RobotToken
                name={robot.name}
                color={robot.color}
                dir={robot.dir}
                robotImage={robot.robotImage}
                showDirection={showRobotDirection}
              />
            ) : null}
          </div>
        );
      })}
      {animatedRobot && animatedRect ? (
        <div
          className="pointer-events-none absolute z-30"
          style={{
            left: animatedRect.left,
            top: animatedRect.top,
            width: animatedRect.width,
            height: animatedRect.height,
            transition: shouldAnimatePosition
              ? `left ${robotTransitionMs}ms ease-in-out, top ${robotTransitionMs}ms ease-in-out`
              : "none"
          }}
        >
          <RobotToken
            name={animatedRobot.name}
            color={animatedRobot.color}
            dir={animatedRobot.dir}
            robotImage={animatedRobot.robotImage}
            showDirection={showRobotDirection}
          />
        </div>
      ) : null}
    </div>
  );
}
