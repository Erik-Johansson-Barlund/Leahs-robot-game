import { ValidationResult } from "@/engine/types";
import { useI18n } from "@/i18n/I18nContext";

interface ValidationPanelProps {
  result: ValidationResult;
}

export function ValidationPanel({ result }: ValidationPanelProps) {
  const { t } = useI18n();
  const codeToKey = {
    wrong_start_count: "validation.wrong_start_count",
    wrong_goal_count: "validation.wrong_goal_count",
    disconnected_graph: "validation.disconnected_graph",
    open_connector: "validation.open_connector",
    unreachable_goal: "validation.unreachable_goal"
  } as const;

  return (
    <div className="rounded-3xl bg-emerald-100/80 p-4 shadow-xl">
      <h3 className="font-display text-2xl font-black text-emerald-900">{t("validation.title")}</h3>
      {result.isValid ? (
        <p className="mt-2 rounded-2xl bg-emerald-300 px-3 py-2 text-sm font-black text-emerald-900">
          {t("validation.success")}
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {result.errors.map((error) => (
            <li
              key={error.code}
              className="rounded-2xl border-2 border-rose-300 bg-rose-100 px-3 py-2 text-sm font-bold text-rose-900"
            >
              {t(codeToKey[error.code])}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
