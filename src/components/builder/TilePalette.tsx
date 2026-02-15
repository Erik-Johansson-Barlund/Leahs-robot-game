import { useDraggable } from "@dnd-kit/core";
import { TileType } from "@/engine/types";
import { Tile } from "@/components/board/Tile";
import { useI18n } from "@/i18n/I18nContext";

const tileTypes: TileType[] = ["straight", "corner", "tee", "cross", "start", "goal"];

function tileLabelKey(type: TileType) {
  const map = {
    straight: "tile.straight",
    corner: "tile.corner",
    tee: "tile.tee",
    cross: "tile.cross",
    start: "tile.start",
    goal: "tile.goal"
  } as const;
  return map[type];
}

function PaletteTile({ type }: { type: TileType }) {
  const { t } = useI18n();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      source: "palette",
      tileType: type
    }
  });

  return (
    <button
      type="button"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`w-full rounded-2xl bg-white/80 p-2 text-left shadow transition ${isDragging ? "opacity-0" : "hover:-translate-y-0.5"}`}
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12">
          <Tile tile={{ type, rot: 0 }} />
        </div>
        <span className="font-display text-lg font-black text-slate-700">{t(tileLabelKey(type))}</span>
      </div>
    </button>
  );
}

export function TilePalette() {
  const { t } = useI18n();

  return (
    <div className="space-y-3 rounded-3xl bg-orange-200/70 p-4 shadow-xl">
      <h3 className="font-display text-2xl font-black text-orange-900">{t("builder.tileBox")}</h3>
      {tileTypes.map((type) => (
        <PaletteTile key={type} type={type} />
      ))}
      <p className="rounded-2xl bg-white/70 p-2 text-sm font-bold text-slate-700">{t("builder.dragHelp")}</p>
    </div>
  );
}
