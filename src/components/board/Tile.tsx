import { Tile as TileModel } from "@/engine/types";
import { getConnectors } from "@/engine/tileConnectivity";

interface TileProps {
  tile: TileModel;
  highlighted?: boolean;
  onClick?: () => void;
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

export function Tile({ tile, highlighted = false, onClick }: TileProps) {
  const connectors = getConnectors(tile);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`relative h-full w-full rounded-2xl border-2 border-white/80 p-0 shadow-md transition hover:scale-[1.03] disabled:cursor-default ${tileColors[tile.type]} ${highlighted ? "ring-4 ring-amber-400" : ""}`}
    >
      {connectors.map((dir) => (
        <span
          key={dir}
          className={`absolute ${connectorStyle[dir]} rounded-full bg-white`}
        />
      ))}
      <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm" />
      {tile.type === "goal" ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl leading-none animate-bob filter brightness-110 saturate-150 drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]">
            👑
          </span>
        </span>
      ) : null}
    </button>
  );
}
