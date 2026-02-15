import { useMemo, useState } from "react";
import { BuilderCanvas } from "@/components/builder/BuilderCanvas";
import { ValidationPanel } from "@/components/builder/ValidationPanel";
import { BOARD_HEIGHT, BOARD_WIDTH, Rotation, TileMap, TileType } from "@/engine/types";
import { validateTrack } from "@/engine/validateTrack";
import { useConvexCreateTrack } from "@/convex/tracks";
import { useI18n } from "@/i18n/I18nContext";

interface BuildCoreProps {
  saveTrack?: (input: { name: string; width: number; height: number; tiles: TileMap }) => Promise<unknown>;
}

function nextRotation(rot: Rotation): Rotation {
  return ((rot + 90) % 360) as Rotation;
}

function BuildCore({ saveTrack }: BuildCoreProps) {
  const { t } = useI18n();
  const [name, setName] = useState(t("build.defaultName"));
  const [tiles, setTiles] = useState<TileMap>({});
  const [status, setStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const validation = useMemo(() => validateTrack(tiles, BOARD_WIDTH, BOARD_HEIGHT), [tiles]);
  const highlightedCells = useMemo(
    () => Array.from(new Set(validation.errors.flatMap((error) => error.cells))),
    [validation.errors]
  );

  function placeTile(key: string, type: TileType) {
    setTiles((prev) => ({
      ...prev,
      [key]: { type, rot: 0 }
    }));
  }

  function moveTile(fromKey: string, toKey: string) {
    setTiles((prev) => {
      const moving = prev[fromKey];
      if (!moving || prev[toKey]) {
        return prev;
      }

      const next = { ...prev };
      delete next[fromKey];
      next[toKey] = moving;
      return next;
    });
  }

  function removeTile(key: string) {
    setTiles((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function rotateTile(key: string) {
    setTiles((prev) => {
      const tile = prev[key];
      if (!tile) {
        return prev;
      }

      return {
        ...prev,
        [key]: {
          ...tile,
          rot: nextRotation(tile.rot)
        }
      };
    });
  }

  async function onSave() {
    if (!saveTrack || !validation.isValid) {
      return;
    }

    setIsSaving(true);
    setStatus("");
    try {
      await saveTrack({
        name: name.trim() || t("build.untitled"),
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        tiles
      });
      setStatus(t("build.saved"));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t("build.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-amber-100/80 p-5 shadow-xl">
        <h1 className="font-display text-4xl font-black text-amber-900">{t("build.title")}</h1>
        <p className="mt-1 text-lg font-bold text-amber-800">{t("build.subtitle")}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="min-w-[240px] flex-1 rounded-2xl border-2 border-amber-300 px-4 py-2 text-lg font-black"
            maxLength={40}
          />
          <button
            type="button"
            onClick={() => setTiles({})}
            className="rounded-2xl bg-white px-4 py-2 text-lg font-black text-amber-900 shadow"
          >
            {t("build.clearGrid")}
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!saveTrack || !validation.isValid || isSaving}
            className="rounded-2xl bg-amber-500 px-4 py-2 text-lg font-black text-white shadow transition enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {saveTrack ? (isSaving ? t("build.saving") : t("build.save")) : t("build.noConvex")}
          </button>
        </div>

        {status ? (
          <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-sm font-black text-slate-700">{status}</p>
        ) : null}
      </section>

      <div className="grid items-start gap-4 xl:grid-cols-[1fr_280px]">
        <BuilderCanvas
          width={BOARD_WIDTH}
          height={BOARD_HEIGHT}
          tiles={tiles}
          highlights={highlightedCells}
          onPlace={placeTile}
          onMove={moveTile}
          onRemove={removeTile}
          onRotate={rotateTile}
        />
        <div className="xl:sticky xl:top-4">
          <ValidationPanel result={validation} />
        </div>
      </div>
    </div>
  );
}

function BuildWithConvex() {
  const createTrack = useConvexCreateTrack();

  return <BuildCore saveTrack={(input) => (createTrack as any)(input)} />;
}

function BuildWithoutConvex() {
  return <BuildCore />;
}

export function Build() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  return hasConvex ? <BuildWithConvex /> : <BuildWithoutConvex />;
}
