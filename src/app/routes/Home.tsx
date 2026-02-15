import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import homeBg from "../../../bg.png";

export function Home() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-[calc(100vh-210px)] overflow-hidden pb-32 md:pb-44">
      <img
        src={homeBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto w-full max-w-[1080px] object-contain"
      />
      <div className="relative z-10 space-y-8">
        <section className="rounded-[2rem] bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 p-8 shadow-2xl">
          <h1 className="font-display text-5xl font-black text-slate-900 md:text-6xl">{t("home.title")}</h1>
          <p className="mt-3 max-w-2xl text-xl font-bold text-slate-800">{t("home.subtitle")}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Link
            to="/play"
            className="rounded-3xl bg-lime-300 p-6 text-center shadow-xl transition hover:-translate-y-1"
          >
            <p className="text-5xl">🤖</p>
            <h2 className="font-display text-4xl font-black text-lime-900">{t("home.playTitle")}</h2>
            <p className="mt-2 text-lg font-bold text-lime-800">{t("home.playDesc")}</p>
          </Link>
          <Link
            to="/build"
            className="rounded-3xl bg-amber-300 p-6 text-center shadow-xl transition hover:-translate-y-1"
          >
            <p className="text-5xl">🧩</p>
            <h2 className="font-display text-4xl font-black text-amber-900">{t("home.buildTitle")}</h2>
            <p className="mt-2 text-lg font-bold text-amber-800">{t("home.buildDesc")}</p>
          </Link>
        </section>
      </div>
    </div>
  );
}
