import { Link, NavLink, Route, Routes } from "react-router-dom";
import { Build } from "@/app/routes/Build";
import { Home } from "@/app/routes/Home";
import { Play } from "@/app/routes/Play";
import { GameSessionProvider } from "@/context/GameSessionContext";

function NavTab({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-2xl px-4 py-2 text-lg font-black transition ${
          isActive ? "bg-white text-sky-700 shadow" : "bg-sky-700/50 text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function App() {
  return (
    <GameSessionProvider>
      <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#7dd3fc,transparent_40%),radial-gradient(circle_at_80%_0%,#fcd34d,transparent_35%),linear-gradient(135deg,#22d3ee,#60a5fa,#34d399)] font-body text-slate-900">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-6 md:px-8">
          <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-sky-800/80 p-4 shadow-2xl backdrop-blur">
            <Link to="/" className="font-display text-3xl font-black text-white">
              BlueBot
            </Link>
            <nav className="flex items-center gap-2">
              <NavTab to="/" label="Home" />
              <NavTab to="/play" label="Play" />
              <NavTab to="/build" label="Build" />
            </nav>
          </header>

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/play" element={<Play />} />
              <Route path="/build" element={<Build />} />
            </Routes>
          </main>
        </div>
      </div>
    </GameSessionProvider>
  );
}
