import { useEffect, useState } from "react";
import { Command } from "@/engine/types";
import { CommandPalette } from "./CommandPalette";

interface ProgramBuilderProps {
  playerId: string;
  initialCommands?: Command[];
  onDone: (commands: Command[]) => void;
}

const commandIcon: Record<Command, string> = {
  forward: "↑",
  backward: "↓",
  turnLeft: "↺",
  turnRight: "↻"
};

export function ProgramBuilder({ playerId, initialCommands = [], onDone }: ProgramBuilderProps) {
  const [commands, setCommands] = useState<Command[]>([]);

  useEffect(() => {
    setCommands(initialCommands);
  }, [playerId, initialCommands]);

  function addCommand(command: Command) {
    setCommands((prev) => {
      if (prev.length >= 30) {
        return prev;
      }
      return [...prev, command];
    });
  }

  function removeAt(index: number) {
    setCommands((prev) => prev.filter((_, idx) => idx !== index));
  }

  return (
    <div className="space-y-4">
      <CommandPalette onPick={addCommand} disabled={commands.length >= 30} />

      <div className="rounded-3xl bg-sky-100 p-4 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-2xl font-black text-sky-900">Program Steps ({commands.length}/30)</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCommands((prev) => prev.slice(0, -1))}
              disabled={commands.length === 0}
              className="rounded-xl bg-white px-3 py-1 text-sm font-black text-slate-700 shadow disabled:opacity-40"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={() => setCommands([])}
              disabled={commands.length === 0}
              className="rounded-xl bg-white px-3 py-1 text-sm font-black text-slate-700 shadow disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto pb-2">
          <div className="flex min-h-20 items-center gap-2">
            {commands.length === 0 ? (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-500">
                Click command buttons to add steps.
              </p>
            ) : (
              commands.map((command, index) => (
                <button
                  key={`${command}-${index}`}
                  type="button"
                  onClick={() => removeAt(index)}
                  title="Click to remove this step"
                  className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl font-black text-sky-800 shadow transition hover:-translate-y-0.5"
                >
                  {commandIcon[command]}
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-[10px] font-black text-white">
                    {index + 1}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        <p className="text-xs font-bold text-slate-600">Tip: click any step icon to remove it.</p>
      </div>

      <button
        type="button"
        onClick={() => onDone(commands)}
        className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-2xl font-black text-white shadow-lg transition hover:scale-[1.01]"
      >
        Done
      </button>
    </div>
  );
}
