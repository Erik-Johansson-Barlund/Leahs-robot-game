import { Tile as TileModel } from "@/engine/types";
import { getConnectors } from "@/engine/tileConnectivity";
import roadCross from "@/assets/roads/roadcross.png";
import roadCurve from "@/assets/roads/roadcurve.png";
import roadStart from "@/assets/roads/roadstart.png";
import roadStraight from "@/assets/roads/roadstraight.png";
import roadTcross from "@/assets/roads/roadTcross.png";

interface TileProps {
  tile: TileModel;
  highlighted?: boolean;
  onClick?: () => void;
  edgeToEdge?: boolean;
  variant?: "classic" | "road";
}

const tileColors: Record<TileModel["type"], string> = {
  straight: "bg-sky-300",
  corner: "bg-lime-300",
  tee: "bg-amber-300",
  cross: "bg-fuchsia-300",
  start: "bg-cyan-400",
  goal: "bg-rose-400"
};

const connectorStyle: Record<string, string> = {
  N: "left-1/2 top-0 h-1/2 w-2 -translate-x-1/2",
  E: "right-0 top-1/2 h-2 w-1/2 -translate-y-1/2",
  S: "bottom-0 left-1/2 h-1/2 w-2 -translate-x-1/2",
  W: "left-0 top-1/2 h-2 w-1/2 -translate-y-1/2"
};

const roadImageByType: Record<TileModel["type"], string> = {
  straight: roadStraight,
  corner: roadCurve,
  tee: roadTcross,
  cross: roadCross,
  start: roadStart,
  goal: roadCross
};

function getRoadRotation(tile: TileModel): number {
  if (tile.type === "corner") {
    return (tile.rot + 270) % 360;
  }
  if (tile.type === "tee") {
    return (tile.rot + 180) % 360;
  }
  if (tile.type === "straight" || tile.type === "start") {
    return tile.rot;
  }
  return 0;
}

export function Tile({
  tile,
  highlighted = false,
  onClick,
  edgeToEdge = false,
  variant = "classic"
}: TileProps) {
  const connectors = variant === "classic" ? getConnectors(tile) : [];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`relative h-full w-full p-0 transition disabled:cursor-default ${
        variant === "road"
          ? `${edgeToEdge ? "rounded-[0.9rem]" : "rounded-2xl"} overflow-hidden border-0 bg-transparent shadow-none`
          : `${tileColors[tile.type]} ${
              edgeToEdge
                ? "rounded-[0.9rem] border-0 shadow-none"
                : "rounded-2xl border-2 border-white/80 shadow-md hover:scale-[1.03]"
            }`
      } ${highlighted ? "ring-4 ring-amber-400" : ""}`}
    >
      {variant === "road" ? (
        <img
          src={roadImageByType[tile.type]}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-300"
          style={{ transform: `rotate(${getRoadRotation(tile)}deg) scale(1.1)` }}
        />
      ) : (
        <>
          {connectors.map((dir) => (
            <span
              key={dir}
              className={`absolute ${connectorStyle[dir]} rounded-full bg-white`}
            />
          ))}
          <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm" />
        </>
      )}
      {tile.type === "goal" && variant !== "road" ? (
        <span className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-visible">
          <span className="text-7xl leading-none animate-bob filter brightness-125 saturate-160 drop-shadow-[0_0_14px_rgba(250,204,21,0.95)]">
            👑
          </span>
        </span>
      ) : null}
    </button>
  );
}
