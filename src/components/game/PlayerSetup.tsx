import { useMemo, useState } from "react";
import { Player } from "@/engine/types";

const robotColors = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
  "#8b5cf6",
  "#f97316"
];

interface PlayerSetupProps {
  onSubmit: (players: Player[]) => void;
}

interface PlayerDraft {
  id: string;
  name: string;
  color: string;
}

function normalizeDrafts(count: number, drafts: PlayerDraft[]): PlayerDraft[] {
  return Array.from({ length: count }).map((_, idx) => {
    const existing = drafts[idx];
    return (
      existing ?? {
        id: `p${idx + 1}`,
        name: `Player ${idx + 1}`,
        color: robotColors[idx]
      }
    );
  });
}

export function PlayerSetup({ onSubmit }: PlayerSetupProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [drafts, setDrafts] = useState<PlayerDraft[]>(normalizeDrafts(2, []));

  const normalizedDrafts = useMemo(
    () => normalizeDrafts(playerCount, drafts),
    [playerCount, drafts]
  );

  const colorSet = new Set(normalizedDrafts.map((player) => player.color));
  const namesOk = normalizedDrafts.every((player) => player.name.trim().length > 0);
  const colorsUnique = colorSet.size === normalizedDrafts.length;
  const isReady = namesOk && colorsUnique;

  function updateDraft(index: number, next: Partial<PlayerDraft>) {
    setDrafts((prev) => {
      const nextDrafts = normalizeDrafts(playerCount, prev);
      nextDrafts[index] = { ...nextDrafts[index], ...next };
      return nextDrafts;
    });
  }

  function onStartGame() {
    if (!isReady) {
      return;
    }
    onSubmit(normalizedDrafts.map((draft, idx) => ({ ...draft, id: `p${idx + 1}` })));
  }

  return (
    <div className="space-y-5 rounded-3xl bg-lime-100/80 p-6 shadow-xl">
      <h2 className="font-display text-4xl font-black text-lime-900">Choose Your Robot Team</h2>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => {
              setPlayerCount(count);
              setDrafts((prev) => normalizeDrafts(count, prev));
            }}
            className={`rounded-2xl px-4 py-2 text-lg font-black transition ${
              playerCount === count
                ? "bg-lime-500 text-white shadow-lg"
                : "bg-white text-lime-900 shadow"
            }`}
          >
            {count} Player{count > 1 ? "s" : ""}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {normalizedDrafts.map((player, idx) => (
          <div key={player.id} className="rounded-2xl bg-white/85 p-4 shadow">
            <p className="font-display text-2xl font-black text-slate-700">Robot {idx + 1}</p>
            <input
              className="mt-2 w-full rounded-2xl border-2 border-slate-200 px-3 py-2 text-lg font-bold"
              value={player.name}
              onChange={(event) => updateDraft(idx, { name: event.target.value })}
              maxLength={20}
            />
            <div className="mt-3 grid grid-cols-4 gap-2">
              {robotColors.map((color) => {
                const inUse =
                  normalizedDrafts.some((draft, draftIndex) => draftIndex !== idx && draft.color === color);

                return (
                  <button
                    key={color}
                    type="button"
                    title={inUse ? "Already used" : "Pick color"}
                    disabled={inUse}
                    onClick={() => updateDraft(idx, { color })}
                    className={`h-10 rounded-xl border-4 transition ${
                      player.color === color ? "border-slate-900" : "border-white"
                    } ${inUse ? "opacity-40" : "hover:scale-105"}`}
                    style={{ backgroundColor: color }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!colorsUnique ? (
        <p className="rounded-2xl bg-rose-200 px-3 py-2 text-sm font-black text-rose-800">
          Each robot must use a different color.
        </p>
      ) : null}

      <button
        type="button"
        onClick={onStartGame}
        disabled={!isReady}
        className="w-full rounded-2xl bg-lime-600 px-5 py-3 text-2xl font-black text-white shadow-lg transition enabled:hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Start Programming
      </button>
    </div>
  );
}
