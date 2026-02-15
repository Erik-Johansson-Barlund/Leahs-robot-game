import { Command } from "@/engine/types";

const commandDisplay: Array<{ command: Command; label: string; icon: string }> = [
  { command: "forward", label: "Forward", icon: "↑" },
  { command: "backward", label: "Backward", icon: "↓" },
  { command: "turnLeft", label: "Turn Left", icon: "↺" },
  { command: "turnRight", label: "Turn Right", icon: "↻" }
];

interface CommandPaletteProps {
  onPick: (command: Command) => void;
  disabled?: boolean;
}

export function CommandPalette({ onPick, disabled = false }: CommandPaletteProps) {
  return (
    <div className="space-y-3 rounded-3xl bg-violet-200/80 p-4 shadow-lg">
      <h3 className="font-display text-2xl font-black text-violet-900">Command Buttons</h3>
      <div className="grid grid-cols-2 gap-2">
        {commandDisplay.map((item) => (
          <button
            key={item.command}
            type="button"
            onClick={() => onPick(item.command)}
            disabled={disabled}
            className="rounded-2xl bg-white px-3 py-4 font-black text-violet-900 shadow transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="block text-3xl leading-none">{item.icon}</span>
            <span className="mt-1 block text-sm">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
