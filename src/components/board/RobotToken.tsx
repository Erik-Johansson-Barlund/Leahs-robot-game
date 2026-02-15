import { Direction } from "@/engine/types";

interface RobotTokenProps {
  name: string;
  color: string;
  dir: Direction;
  robotImage?: string;
  showDirection?: boolean;
}

const arrowRotation: Record<Direction, string> = {
  N: "rotate-0",
  E: "rotate-90",
  S: "rotate-180",
  W: "-rotate-90"
};

export function RobotToken({ name, color, dir, robotImage, showDirection = true }: RobotTokenProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 animate-bob">
      <div
        className="relative flex h-full w-full items-center justify-center transition-all duration-500"
      >
        <div className="relative h-full w-full overflow-visible">
          {robotImage ? (
            <img
              src={robotImage}
              alt={name}
              className="h-full w-full -translate-y-[5px] scale-[1.42] object-contain object-center drop-shadow-[0_5px_10px_rgba(0,0,0,0.3)]"
            />
          ) : (
            <div className="h-full w-full" style={{ backgroundColor: color }} />
          )}
          {showDirection ? (
            <div
              className={`absolute inset-0 z-40 flex items-center justify-center ${arrowRotation[dir]} transition-transform duration-500`}
              style={{ transformOrigin: "center center" }}
            >
              <span className="block translate-y-[4px] text-lg font-black leading-none text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.75)]">
                ▲
              </span>
            </div>
          ) : null}
        </div>

        <span className="absolute -bottom-5 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-2 py-0.5 text-xs font-black text-slate-700 shadow-xl">
          {name}
        </span>
      </div>
    </div>
  );
}
