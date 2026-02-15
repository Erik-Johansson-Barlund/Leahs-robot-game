import { Direction } from "@/engine/types";

interface RobotTokenProps {
  name: string;
  color: string;
  dir: Direction;
}

const arrowRotation: Record<Direction, string> = {
  N: "rotate-0",
  E: "rotate-90",
  S: "rotate-180",
  W: "-rotate-90"
};

export function RobotToken({ name, color, dir }: RobotTokenProps) {
  return (
    <div className="pointer-events-none absolute inset-1 animate-bob">
      <div
        className="relative flex h-full w-full items-center justify-center rounded-full border-4 border-white shadow-lg transition-all duration-500"
        style={{ backgroundColor: color }}
      >
        <span className={`text-lg font-black text-white drop-shadow ${arrowRotation[dir]} transition-transform duration-500`}>
          ▲
        </span>
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-2 py-0.5 text-xs font-black text-slate-700 shadow">
          {name}
        </span>
      </div>
    </div>
  );
}
