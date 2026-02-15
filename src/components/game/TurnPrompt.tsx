import { useI18n } from "@/i18n/I18nContext";

interface TurnPromptProps {
  name: string;
  color: string;
  robotImage?: string;
  turn: number;
  total: number;
}

export function TurnPrompt({ name, color, robotImage, turn, total }: TurnPromptProps) {
  const { t } = useI18n();

  return (
    <div
      className="animate-pop rounded-3xl border-4 border-white p-5 text-center text-slate-900 shadow-xl"
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center justify-center gap-3">
        {robotImage ? (
          <img src={robotImage} alt={name} className="h-16 w-16 rounded-2xl bg-white/90 p-1 shadow" />
        ) : null}
        <p className="font-display text-4xl font-black">{t("turn.prompt", { name })}</p>
      </div>
      <p className="mt-1 text-lg font-black text-slate-800">{t("turn.counter", { turn, total })}</p>
    </div>
  );
}
