import { ValidationResult } from "@/engine/types";

interface ValidationPanelProps {
  result: ValidationResult;
}

export function ValidationPanel({ result }: ValidationPanelProps) {
  return (
    <div className="rounded-3xl bg-emerald-100/80 p-4 shadow-xl">
      <h3 className="font-display text-2xl font-black text-emerald-900">Track Check</h3>
      {result.isValid ? (
        <p className="mt-2 rounded-2xl bg-emerald-300 px-3 py-2 text-sm font-black text-emerald-900">
          Awesome! Your track is ready to save.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {result.errors.map((error) => (
            <li
              key={error.code}
              className="rounded-2xl border-2 border-rose-300 bg-rose-100 px-3 py-2 text-sm font-bold text-rose-900"
            >
              {error.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
