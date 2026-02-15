import { useEffect, useRef, useState } from "react";
import { Command } from "@/engine/types";
import { useI18n } from "@/i18n/I18nContext";
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
  const { t } = useI18n();
  const [commands, setCommands] = useState<Command[]>([]);
  const stepsScrollerRef = useRef<HTMLDivElement | null>(null);
  const previousCommandCountRef = useRef(0);

  useEffect(() => {
    setCommands(initialCommands);
  }, [playerId, initialCommands]);

  useEffect(() => {
    const scroller = stepsScrollerRef.current;
    if (!scroller) {
      previousCommandCountRef.current = commands.length;
      return;
    }

    const grew = commands.length > previousCommandCountRef.current;
    scroller.scrollTo({
      left: scroller.scrollWidth,
      behavior: grew ? "smooth" : "auto"
    });
    previousCommandCountRef.current = commands.length;
  }, [commands.length]);

  function addCommand(command: Command) {
    setCommands((prev) => [...prev, command]);
  }

  function removeAt(index: number) {
    setCommands((prev) => prev.filter((_, idx) => idx !== index));
  }

  return (
    <div className="space-y-4">
      <CommandPalette onPick={addCommand} />

      <div className="rounded-3xl bg-sky-100 p-4 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-2xl font-black text-sky-900">
            {t("program.steps", { count: commands.length })}
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCommands((prev) => prev.slice(0, -1))}
              disabled={commands.length === 0}
              className="rounded-xl bg-white px-3 py-1 text-sm font-black text-slate-700 shadow disabled:opacity-40"
            >
              {t("program.undo")}
            </button>
            <button
              type="button"
              onClick={() => setCommands([])}
              disabled={commands.length === 0}
              className="rounded-xl bg-white px-3 py-1 text-sm font-black text-slate-700 shadow disabled:opacity-40"
            >
              {t("program.clear")}
            </button>
          </div>
        </div>

        <div ref={stepsScrollerRef} className="mt-3 overflow-x-auto pb-2">
          <div className="flex min-h-20 items-center gap-2">
            {commands.length === 0 ? (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-500">{t("program.empty")}</p>
            ) : (
              commands.map((command, index) => (
                <button
                  key={`${command}-${index}`}
                  type="button"
                  onClick={() => removeAt(index)}
                  title={t("program.removeStepTitle")}
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

        <p className="text-xs font-bold text-slate-600">{t("program.tip")}</p>
      </div>

      <button
        type="button"
        onClick={() => onDone(commands)}
        className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-2xl font-black text-white shadow-lg transition hover:scale-[1.01]"
      >
        {t("program.done")}
      </button>
    </div>
  );
}
