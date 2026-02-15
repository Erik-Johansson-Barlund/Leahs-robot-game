import { Command } from "@/engine/types";
import { useI18n } from "@/i18n/I18nContext";

const commandDisplay: Array<{ command: Command; key: "commands.forward" | "commands.backward" | "commands.turnLeft" | "commands.turnRight"; icon: string }> = [
  { command: "forward", key: "commands.forward", icon: "↑" },
  { command: "backward", key: "commands.backward", icon: "↓" },
  { command: "turnLeft", key: "commands.turnLeft", icon: "↺" },
  { command: "turnRight", key: "commands.turnRight", icon: "↻" }
];

interface CommandPaletteProps {
  onPick: (command: Command) => void;
  disabled?: boolean;
}

export function CommandPalette({ onPick, disabled = false }: CommandPaletteProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-3 rounded-3xl bg-violet-200/80 p-4 shadow-lg">
      <h3 className="font-display text-2xl font-black text-violet-900">{t("commands.title")}</h3>
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
            <span className="mt-1 block text-sm">{t(item.key)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
