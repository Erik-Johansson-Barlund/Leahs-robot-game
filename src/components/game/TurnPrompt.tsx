interface TurnPromptProps {
  name: string;
  color: string;
  turn: number;
  total: number;
}

export function TurnPrompt({ name, color, turn, total }: TurnPromptProps) {
  return (
    <div
      className="animate-pop rounded-3xl border-4 border-white p-5 text-center text-slate-900 shadow-xl"
      style={{ backgroundColor: color }}
    >
      <p className="font-display text-4xl font-black">It&apos;s {name}&apos;s turn!</p>
      <p className="mt-1 text-lg font-black text-slate-800">
        Player {turn} of {total}
      </p>
    </div>
  );
}
