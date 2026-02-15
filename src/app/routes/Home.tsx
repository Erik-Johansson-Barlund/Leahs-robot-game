import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 p-8 shadow-2xl">
        <h1 className="font-display text-5xl font-black text-slate-900 md:text-6xl">BlueBot Robot Rally</h1>
        <p className="mt-3 max-w-2xl text-xl font-bold text-slate-800">
          Build crazy tracks, program robots, and race one turn at a time.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          to="/play"
          className="rounded-3xl bg-lime-300 p-6 text-center shadow-xl transition hover:-translate-y-1"
        >
          <p className="text-5xl">🤖</p>
          <h2 className="font-display text-4xl font-black text-lime-900">Play Game</h2>
          <p className="mt-2 text-lg font-bold text-lime-800">Choose a track and program 1-4 robots.</p>
        </Link>
        <Link
          to="/build"
          className="rounded-3xl bg-amber-300 p-6 text-center shadow-xl transition hover:-translate-y-1"
        >
          <p className="text-5xl">🧩</p>
          <h2 className="font-display text-4xl font-black text-amber-900">Build Track</h2>
          <p className="mt-2 text-lg font-bold text-amber-800">Drag tiles, rotate, validate, and save.</p>
        </Link>
      </section>
    </div>
  );
}
