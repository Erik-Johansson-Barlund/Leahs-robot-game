import { useMemo, useState } from "react";
import { Player } from "@/engine/types";
import { useI18n } from "@/i18n/I18nContext";
import { ROBOT_OPTIONS, getRobotById } from "@/lib/robots";

interface PlayerSetupProps {
  onSubmit: (players: Player[]) => void;
}

interface PlayerDraft {
  id: string;
  name: string;
  robotId: string;
}

function normalizeDrafts(
  count: number,
  drafts: PlayerDraft[],
  getDefaultName: (index: number) => string
): PlayerDraft[] {
  return Array.from({ length: count }).map((_, idx) => {
    const existing = drafts[idx];
    const fallbackRobot = ROBOT_OPTIONS[idx % ROBOT_OPTIONS.length]!;

    return (
      existing ?? {
        id: `p${idx + 1}`,
        name: getDefaultName(idx + 1),
        robotId: fallbackRobot.id
      }
    );
  });
}

export function PlayerSetup({ onSubmit }: PlayerSetupProps) {
  const { t } = useI18n();
  const [playerCount, setPlayerCount] = useState(2);
  const [drafts, setDrafts] = useState<PlayerDraft[]>([]);

  const getDefaultName = (index: number) => t("players.defaultName", { index });

  const normalizedDrafts = useMemo(
    () => normalizeDrafts(playerCount, drafts, getDefaultName),
    [playerCount, drafts, t]
  );

  const robotSet = new Set(normalizedDrafts.map((player) => player.robotId));
  const namesOk = normalizedDrafts.every((player) => player.name.trim().length > 0);
  const robotsUnique = robotSet.size === normalizedDrafts.length;
  const isReady = namesOk && robotsUnique;

  function updateDraft(index: number, next: Partial<PlayerDraft>) {
    setDrafts((prev) => {
      const nextDrafts = normalizeDrafts(playerCount, prev, getDefaultName);
      nextDrafts[index] = { ...nextDrafts[index], ...next };
      return nextDrafts;
    });
  }

  function onNameFocus(index: number) {
    updateDraft(index, { name: "" });
  }

  function onNameBlur(index: number, value: string) {
    if (value.trim().length === 0) {
      updateDraft(index, { name: getDefaultName(index + 1) });
    }
  }

  function onStartGame() {
    if (!isReady) {
      return;
    }

    onSubmit(
      normalizedDrafts.map((draft, idx) => {
        const robot = getRobotById(draft.robotId);
        return {
          id: `p${idx + 1}`,
          name: draft.name,
          color: robot.color,
          robotId: robot.id,
          robotImage: robot.image
        };
      })
    );
  }

  return (
    <div className="space-y-4 rounded-3xl bg-lime-100/80 p-5 shadow-xl">
      <h2 className="font-display text-4xl font-black text-lime-900">{t("players.title")}</h2>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => {
              setPlayerCount(count);
              setDrafts((prev) => normalizeDrafts(count, prev, getDefaultName));
            }}
            className={`rounded-2xl px-4 py-2 text-lg font-black transition ${
              playerCount === count
                ? "bg-lime-500 text-white shadow-lg"
                : "bg-white text-lime-900 shadow"
            }`}
          >
            {t("players.count", {
              count,
              suffix: count > 1 ? t("players.suffixPlural") : t("players.suffixSingle")
            })}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {normalizedDrafts.map((player, idx) => {
          const selectedRobot = getRobotById(player.robotId);

          return (
            <div key={player.id} className="rounded-2xl bg-white/85 p-3 shadow">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-2xl font-black text-slate-700">
                  {t("players.robot", { index: idx + 1 })}
                </p>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-2 py-1">
                  <img
                    src={selectedRobot.image}
                    alt={t(selectedRobot.nameKey)}
                    className="h-10 w-10 object-contain object-center"
                  />
                  <p className="text-base font-black" style={{ color: selectedRobot.color }}>
                    {t(selectedRobot.nameKey)}
                  </p>
                </div>
              </div>

              <input
                className="mt-2 w-full rounded-2xl border-2 border-slate-200 px-3 py-2 text-lg font-bold"
                value={player.name}
                onChange={(event) => updateDraft(idx, { name: event.target.value })}
                onFocus={() => onNameFocus(idx)}
                onBlur={(event) => onNameBlur(idx, event.target.value)}
                maxLength={20}
              />

              <div className="mt-2 grid grid-cols-4 gap-2">
                {ROBOT_OPTIONS.map((robot) => {
                  const inUse = normalizedDrafts.some(
                    (draft, draftIndex) => draftIndex !== idx && draft.robotId === robot.id
                  );

                  return (
                    <button
                      key={robot.id}
                      type="button"
                      title={inUse ? t("players.colorUsed") : t("players.pickColor")}
                      disabled={inUse}
                      onClick={() => updateDraft(idx, { robotId: robot.id })}
                      className={`flex h-[88px] items-center justify-center rounded-xl border-4 bg-white p-1 transition ${
                        player.robotId === robot.id ? "border-slate-900" : "border-white"
                      } ${inUse ? "opacity-40" : "hover:scale-105"}`}
                      style={{ borderColor: player.robotId === robot.id ? robot.color : undefined }}
                    >
                      <img
                        src={robot.image}
                        alt={t(robot.nameKey)}
                        className="h-[82px] w-[82px] object-contain object-center"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!robotsUnique ? (
        <p className="rounded-2xl bg-rose-200 px-3 py-2 text-sm font-black text-rose-800">
          {t("players.uniqueColorError")}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onStartGame}
        disabled={!isReady}
        className="w-full rounded-2xl bg-lime-600 px-5 py-3 text-2xl font-black text-white shadow-lg transition enabled:hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {t("players.startProgramming")}
      </button>
    </div>
  );
}
