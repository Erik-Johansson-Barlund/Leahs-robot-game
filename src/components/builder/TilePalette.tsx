import { useDraggable } from "@dnd-kit/core";
import { TileType } from "@/engine/types";
import { Tile } from "@/components/board/Tile";

const tileTypes: TileType[] = ["straight", "corner", "tee", "cross", "start", "goal"];

function PaletteTile({ type }: { type: TileType }) {
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
        <span className="font-display text-lg font-black capitalize text-slate-700">{type}</span>
      </div>
    </button>
  );
}

export function TilePalette() {
  return (
    <div className="space-y-3 rounded-3xl bg-orange-200/70 p-4 shadow-xl">
      <h3 className="font-display text-2xl font-black text-orange-900">Tile Box</h3>
      {tileTypes.map((type) => (
        <PaletteTile key={type} type={type} />
      ))}
      <p className="rounded-2xl bg-white/70 p-2 text-sm font-bold text-slate-700">
        Drag tiles to the board. Tap placed tiles to rotate.
      </p>
    </div>
  );
}
