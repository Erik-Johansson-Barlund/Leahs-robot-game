import { useEffect, useMemo, useState } from "react";
import { Board } from "@/components/board/Board";
import { coordToKey } from "@/engine/tileConnectivity";
import { getFrameDurationMs } from "@/engine/simulate";
import { Player, PlayerRun, SimulationResult, Track } from "@/engine/types";
import { useI18n } from "@/i18n/I18nContext";

interface PlaybackViewProps {
  track: Track;
  players: Player[];
  result: SimulationResult;
  onFinished: () => void;
}

function didReachGoal(run: PlayerRun, track: Track): boolean {
  return run.frames.some((frame) => {
    if (frame.status === "reachedGoal") {
      return true;
    }
    return track.tiles[coordToKey({ x: frame.x, y: frame.y })]?.type === "goal";
  });
}

function getOutcomeMessage(
  playerName: string,
  run: PlayerRun,
  track: Track,
  t: ReturnType<typeof useI18n>["t"]
) {
  if (didReachGoal(run, track)) {
    return t("playback.reachedGoal", { name: playerName });
  }

  if (run.endedBecause === "blocked") {
    return t("playback.hitWall", { name: playerName });
  }

  return t("playback.outOfGas", { name: playerName });
}

export function PlaybackView({ track, players, result, onFinished }: PlaybackViewProps) {
  const { t } = useI18n();
  const [runIndex, setRunIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [phase, setPhase] = useState<"running" | "announcement">("running");
  const [announcement, setAnnouncement] = useState<{ message: string; color: string } | null>(null);

  const playerById = useMemo(
    () => Object.fromEntries(players.map((player) => [player.id, player])),
    [players]
  );

  const stepMs = getFrameDurationMs();
  const betweenPlayersMs = 3000;
  const currentRun = result.runs[runIndex];
  const currentFrame = currentRun?.frames[frameIndex];

  useEffect(() => {
    setRunIndex(0);
    setFrameIndex(0);
    setPhase("running");
    setAnnouncement(null);
  }, [result]);

  useEffect(() => {
    if (!currentRun) {
      return;
    }

    if (phase === "running") {
      if (frameIndex < currentRun.frames.length - 1) {
        const timer = window.setTimeout(() => {
          setFrameIndex((prev) => prev + 1);
        }, stepMs);
        return () => window.clearTimeout(timer);
      }

      const player = playerById[currentRun.playerId];
      setAnnouncement({
        message: getOutcomeMessage(player?.name ?? t("playback.playerFallback"), currentRun, track, t),
        color: player?.color ?? "#0f172a"
      });
      setPhase("announcement");
      return;
    }

    if (phase === "announcement") {
      if (runIndex < result.runs.length - 1) {
        const timer = window.setTimeout(() => {
          setAnnouncement(null);
          setRunIndex((prev) => prev + 1);
          setFrameIndex(0);
          setPhase("running");
        }, betweenPlayersMs);
        return () => window.clearTimeout(timer);
      }

      const timer = window.setTimeout(() => {
        onFinished();
      }, betweenPlayersMs);
      return () => window.clearTimeout(timer);
    }
  }, [currentRun, frameIndex, onFinished, phase, playerById, result.runs.length, runIndex, stepMs, track, t]);

  const activePlayer = currentRun ? playerById[currentRun.playerId] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-cyan-100/80 p-5 shadow-xl">
        <h2 className="font-display text-4xl font-black text-cyan-900">{t("playback.title")}</h2>
        {activePlayer ? (
          <p className="mt-1 text-xl font-black text-cyan-800">
            {t("playback.running", {
              name: activePlayer.name,
              index: runIndex + 1,
              total: result.runs.length
            })}
          </p>
        ) : null}
      </div>

      <div className="relative">
        <Board
          width={track.width}
          height={track.height}
          tiles={track.tiles}
          tileVariant="road"
          showRobotDirection={false}
          animateRobots
          robotTransitionMs={Math.max(stepMs - 40, 300)}
          robots={
            currentFrame && activePlayer
              ? [
                  {
                    id: activePlayer.id,
                    x: currentFrame.x,
                    y: currentFrame.y,
                    dir: currentFrame.dir,
                    color: activePlayer.color,
                    robotImage: activePlayer.robotImage,
                    name: activePlayer.name
                  }
                ]
              : []
          }
        />
        {announcement ? (
          <div className="pointer-events-none absolute inset-0 z-[120] flex items-center justify-center p-4">
            <div
              className="announcement-grow relative z-[130] rounded-3xl border-4 bg-white/95 px-8 py-5 text-center text-4xl font-black shadow-2xl"
              style={{ borderColor: announcement.color, color: announcement.color }}
            >
              {announcement.message}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
