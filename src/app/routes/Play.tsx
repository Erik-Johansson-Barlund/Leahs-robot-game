import { useEffect, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { Board } from "@/components/board/Board";
import { PlaybackView } from "@/components/game/PlaybackView";
import { PlayerSetup } from "@/components/game/PlayerSetup";
import { ProgramBuilder } from "@/components/game/ProgramBuilder";
import { TurnPrompt } from "@/components/game/TurnPrompt";
import { useGameSession } from "@/context/GameSessionContext";
import { coordToKey, getConnectors, listPositionedTiles } from "@/engine/tileConnectivity";
import { simulate } from "@/engine/simulate";
import { Command, Player, PlayerRun, SimulationResult, Track } from "@/engine/types";
import { useI18n } from "@/i18n/I18nContext";
import {
  api,
  getLocalStarterTracks,
  toTrack,
  TrackDoc,
  useConvexTrackList
} from "@/convex/tracks";

type FlowStep = "track" | "players" | "programming" | "playback" | "summary";

interface PlayCoreProps {
  tracks: TrackDoc[];
}

function displayTrackName(name: string, t: ReturnType<typeof useI18n>["t"]) {
  const mapping: Record<string, Parameters<typeof t>[0]> = {
    "Simple Loop": "track.simpleLoop",
    "Zig-Zag Path": "track.zigzag",
    "Branching Tee Path": "track.branching",
    "Central Cross Map": "track.cross"
  };

  const key = mapping[name];
  return key ? t(key) : name;
}

function getProgrammingRobots(
  track: Track,
  players: Player[],
  currentPlayerId: string,
  startOffset: number,
  turnSuffix: string
): Array<{
  x: number;
  y: number;
  name: string;
  color: string;
  dir: "N" | "E" | "S" | "W";
  robotImage?: string;
}> {
  const starts = listPositionedTiles(track.tiles).filter((entry) => entry.tile.type === "start");

  return players.flatMap((player, index) => {
    const shiftedStartIndex =
      starts.length > 0 ? (index + (startOffset % starts.length)) % starts.length : 0;
    const start = starts[shiftedStartIndex] ?? starts[0];
    if (!start) {
      return [];
    }

    const dir = getConnectors(start.tile)[0] ?? "N";
    return [
      {
        x: start.x,
        y: start.y,
        dir,
        color: player.color,
        robotImage: player.robotImage,
        name: player.id === currentPlayerId ? `${player.name} ${turnSuffix}` : player.name
      }
    ];
  });
}

function didReachGoal(run: PlayerRun, track: Track): boolean {
  return run.frames.some((frame) => {
    if (frame.status === "reachedGoal") {
      return true;
    }
    return track.tiles[coordToKey({ x: frame.x, y: frame.y })]?.type === "goal";
  });
}

function TrackSelector({
  tracks,
  selectedId,
  onSelect,
  onContinue
}: {
  tracks: TrackDoc[];
  selectedId: string | null;
  onSelect: (track: TrackDoc) => void;
  onContinue: () => void;
}) {
  const { t } = useI18n();

  return (
    <section className="space-y-4">
      <div className="rounded-3xl bg-sky-100/80 p-5 shadow-xl">
        <h1 className="font-display text-4xl font-black text-sky-900">{t("play.selectTrack")}</h1>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {tracks.map((track) => {
          const id = track._id ?? track.name;
          const selected = id === selectedId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(track)}
              className={`rounded-3xl border-4 p-4 text-left shadow-lg transition ${
                selected ? "border-sky-600 bg-sky-200" : "border-white bg-white/85"
              }`}
            >
              <p className="font-display text-3xl font-black text-slate-800">{displayTrackName(track.name, t)}</p>
              <p className="text-sm font-bold text-slate-600">
                {track.width}×{track.height} • {Object.keys(track.tiles).length} tiles
              </p>
              {track.isStarter ? (
                <span className="mt-2 inline-block rounded-xl bg-emerald-200 px-2 py-1 text-xs font-black text-emerald-900">
                  {t("play.starter")}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!selectedId}
        className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-2xl font-black text-white shadow-lg transition enabled:hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {t("play.continue")}
      </button>
    </section>
  );
}

function ResultsSummary({
  simulation,
  track,
  players,
  onPlayAgain,
  onBackHome
}: {
  simulation: SimulationResult;
  track: Track;
  players: Player[];
  onPlayAgain: () => void;
  onBackHome: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-emerald-100/90 p-5 shadow-xl">
        <h2 className="font-display text-4xl font-black text-emerald-900">{t("play.roundResults")}</h2>
        <p className="mt-1 text-lg font-bold text-emerald-800">{t("play.roundResultsHelp")}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {simulation.runs.map((run) => {
          const player = players.find((entry) => entry.id === run.playerId);
          if (!player) {
            return null;
          }

          const succeeded = didReachGoal(run, track);
          return (
            <div
              key={run.playerId}
              className={`rounded-3xl border-4 bg-white/90 p-4 shadow-lg ${
                succeeded ? "border-emerald-400" : "border-rose-300"
              }`}
            >
              <div className="relative inline-flex items-center gap-2">
                {player.robotImage ? (
                  <img
                    src={player.robotImage}
                    alt={player.name}
                    className="h-10 w-10 rounded-xl bg-white object-contain"
                  />
                ) : null}
                <p className="text-2xl font-black" style={{ color: player.color }}>
                  {player.name}
                </p>
                {succeeded ? (
                  <span className="text-3xl leading-none animate-bob filter brightness-110 saturate-150 drop-shadow-[0_0_8px_rgba(250,204,21,0.85)]">
                    👑
                  </span>
                ) : null}
              </div>
              <p className={`text-xl font-black ${succeeded ? "text-emerald-700" : "text-rose-700"}`}>
                {succeeded ? t("play.succeeded") : t("play.failed")}
              </p>
              <p className="text-sm font-bold text-slate-600">
                {succeeded
                  ? t("play.detail.goal")
                  : run.endedBecause === "blocked"
                    ? t("play.detail.wall")
                    : t("play.detail.gas")}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-2xl bg-emerald-600 px-4 py-3 text-2xl font-black text-white shadow-lg transition hover:scale-[1.01]"
        >
          {t("play.playAgain")}
        </button>
        <button
          type="button"
          onClick={onBackHome}
          className="rounded-2xl bg-white px-4 py-3 text-2xl font-black text-slate-700 shadow-lg transition hover:scale-[1.01]"
        >
          {t("play.backHome")}
        </button>
      </div>
    </div>
  );
}

function PlayCore({ tracks }: PlayCoreProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const {
    selectedTrack,
    setSelectedTrack,
    players,
    setPlayers,
    programs,
    setPrograms,
    simulation,
    setSimulation,
    resetSession
  } = useGameSession();

  const [step, setStep] = useState<FlowStep>("track");
  const [turnIndex, setTurnIndex] = useState(0);
  const [startOffset, setStartOffset] = useState(0);

  const selectedTrackId = useMemo(() => {
    if (!selectedTrack) {
      return null;
    }
    const byName = tracks.find((track) => track.name === selectedTrack.name);
    return byName?._id ?? byName?.name ?? selectedTrack.name;
  }, [selectedTrack, tracks]);

  useEffect(() => {
    if (!selectedTrack && tracks.length > 0) {
      setSelectedTrack(toTrack(tracks[0]!));
    }
  }, [selectedTrack, setSelectedTrack, tracks]);

  const currentPlayer = players[turnIndex] ?? null;
  const programmingRobots = useMemo(
    () =>
      selectedTrack && currentPlayer
        ? getProgrammingRobots(selectedTrack, players, currentPlayer.id, startOffset, t("play.turnSuffix"))
        : [],
    [selectedTrack, players, currentPlayer, startOffset, t]
  );

  function onSelectTrack(track: TrackDoc) {
    setSelectedTrack(toTrack(track));
  }

  function onTrackContinue() {
    if (!selectedTrack) {
      return;
    }
    resetSession();
    setStartOffset(0);
    setStep("players");
  }

  function onPlayersSubmit(nextPlayers: typeof players) {
    setPlayers(nextPlayers);
    setPrograms({});
    setSimulation(null);
    setTurnIndex(0);
    setStartOffset(0);
    setStep("programming");
  }

  function onProgramDone(commands: Command[]) {
    if (!selectedTrack || !currentPlayer) {
      return;
    }

    const nextPrograms = {
      ...programs,
      [currentPlayer.id]: commands
    };

    setPrograms(nextPrograms);

    if (turnIndex >= players.length - 1) {
      setSimulation(simulate(selectedTrack, players, nextPrograms, { startOffset }));
      setStep("playback");
      return;
    }

    setTurnIndex((prev) => prev + 1);
  }

  function onPlayAgain() {
    if (!selectedTrack) {
      return;
    }

    const startCount = listPositionedTiles(selectedTrack.tiles).filter(
      (entry) => entry.tile.type === "start"
    ).length;

    setStartOffset((prev) => {
      const next = prev + 1;
      return startCount > 0 ? next % startCount : next;
    });
    setPrograms({});
    setSimulation(null);
    setTurnIndex(0);
    setStep("programming");
  }

  function onBackHome() {
    resetSession();
    setStartOffset(0);
    setStep("track");
    navigate("/");
  }

  return (
    <div className="space-y-4">
      {step === "track" ? (
        <TrackSelector
          tracks={tracks}
          selectedId={selectedTrackId}
          onSelect={onSelectTrack}
          onContinue={onTrackContinue}
        />
      ) : null}

      {step === "players" ? <PlayerSetup onSubmit={onPlayersSubmit} /> : null}

      {step === "programming" && currentPlayer && selectedTrack ? (
        <div className="space-y-4">
          <TurnPrompt
            name={currentPlayer.name}
            color={currentPlayer.color}
            robotImage={currentPlayer.robotImage}
            turn={turnIndex + 1}
            total={players.length}
          />
          <div className="grid gap-4 xl:grid-cols-[1fr_440px]">
            <div className="space-y-2">
              <div className="rounded-3xl bg-white/80 p-4 shadow-lg">
                <h3 className="font-display text-2xl font-black text-slate-800">{t("play.trackMap")}</h3>
                <p className="text-sm font-bold text-slate-600">{t("play.trackMapHelp")}</p>
              </div>
              <Board
                width={selectedTrack.width}
                height={selectedTrack.height}
                tiles={selectedTrack.tiles}
                robots={programmingRobots}
              />
            </div>
            <ProgramBuilder
              key={currentPlayer.id}
              playerId={currentPlayer.id}
              initialCommands={programs[currentPlayer.id] ?? []}
              onDone={onProgramDone}
            />
          </div>
        </div>
      ) : null}

      {step === "playback" && selectedTrack && simulation ? (
        <PlaybackView
          track={selectedTrack}
          players={players}
          result={simulation}
          onFinished={() => setStep("summary")}
        />
      ) : null}

      {step === "summary" && simulation && selectedTrack ? (
        <ResultsSummary
          simulation={simulation}
          track={selectedTrack}
          players={players}
          onPlayAgain={onPlayAgain}
          onBackHome={onBackHome}
        />
      ) : null}
    </div>
  );
}

function PlayWithConvex() {
  const { t } = useI18n();
  const tracks = useConvexTrackList();
  const seedStarters = useMutation(api.seed.seedStarterTracks as any);
  const [seedRequested, setSeedRequested] = useState(false);

  useEffect(() => {
    if (!tracks || tracks.length > 0 || seedRequested) {
      return;
    }

    setSeedRequested(true);
    void seedStarters({});
  }, [tracks, seedRequested, seedStarters]);

  if (!tracks) {
    return (
      <div className="rounded-3xl bg-white/80 p-6 text-center text-xl font-black text-slate-700 shadow-xl">
        {t("play.loadingTracks")}
      </div>
    );
  }

  return <PlayCore tracks={tracks} />;
}

function PlayWithoutConvex() {
  return <PlayCore tracks={getLocalStarterTracks()} />;
}

export function Play() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  return hasConvex ? <PlayWithConvex /> : <PlayWithoutConvex />;
}
