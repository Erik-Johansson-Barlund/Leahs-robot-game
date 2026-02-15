import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Language, LanguagePreference, TranslationKey, translations } from "./translations";

interface I18nContextValue {
  language: Language;
  preference: LanguagePreference;
  setPreference: (preference: LanguagePreference) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const I18N_STORAGE_KEY = "bluebot-language-preference";

function detectSystemLanguage(): Language {
  if (typeof navigator === "undefined") {
    return "sv";
  }

  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("en")) {
    return "en";
  }
  return "sv";
}

function readStoredPreference(): LanguagePreference {
  if (typeof window === "undefined") {
    return "sv";
  }

  const stored = window.localStorage.getItem(I18N_STORAGE_KEY);
  if (stored === "sv" || stored === "en" || stored === "system") {
    return stored;
  }
  return "sv";
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<LanguagePreference>(() => readStoredPreference());
  const [systemLanguage, setSystemLanguage] = useState<Language>(() => detectSystemLanguage());

  useEffect(() => {
    const updateLanguage = () => setSystemLanguage(detectSystemLanguage());
    window.addEventListener("languagechange", updateLanguage);
    return () => window.removeEventListener("languagechange", updateLanguage);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(I18N_STORAGE_KEY, preference);
  }, [preference]);

  const language: Language = preference === "system" ? systemLanguage : preference;

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      let text = translations[language][key] ?? translations.en[key] ?? key;
      if (!vars) {
        return text;
      }

      Object.entries(vars).forEach(([varKey, value]) => {
        text = text.split(`{${varKey}}`).join(String(value));
      });
      return text;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      preference,
      setPreference,
      t
    }),
    [language, preference, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
