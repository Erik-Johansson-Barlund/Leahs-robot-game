import {
  Command,
  Player,
  SimulationResult,
  Track
} from "@/engine/types";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState
} from "react";

interface GameSessionState {
  selectedTrack: Track | null;
  players: Player[];
  programs: Record<string, Command[]>;
  simulation: SimulationResult | null;
  setSelectedTrack: Dispatch<SetStateAction<Track | null>>;
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  setPrograms: Dispatch<SetStateAction<Record<string, Command[]>>>;
  setSimulation: Dispatch<SetStateAction<SimulationResult | null>>;
  resetSession: () => void;
}

const GameSessionContext = createContext<GameSessionState | null>(null);

export function GameSessionProvider({ children }: { children: ReactNode }) {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [programs, setPrograms] = useState<Record<string, Command[]>>({});
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);

  const value = useMemo(
    () => ({
      selectedTrack,
      players,
      programs,
      simulation,
      setSelectedTrack,
      setPlayers,
      setPrograms,
      setSimulation,
      resetSession: () => {
        setPlayers([]);
        setPrograms({});
        setSimulation(null);
      }
    }),
    [selectedTrack, players, programs, simulation]
  );

  return <GameSessionContext.Provider value={value}>{children}</GameSessionContext.Provider>;
}

export function useGameSession() {
  const context = useContext(GameSessionContext);
  if (!context) {
    throw new Error("useGameSession must be used inside GameSessionProvider");
  }
  return context;
}
