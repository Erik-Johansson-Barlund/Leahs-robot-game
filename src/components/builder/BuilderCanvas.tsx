import {
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { ReactNode, useState } from "react";
import { Tile } from "@/components/board/Tile";
import { coordToKey } from "@/engine/tileConnectivity";
import { Tile as TileModel, TileMap, TileType } from "@/engine/types";
import { TilePalette } from "./TilePalette";

interface BuilderCanvasProps {
  width: number;
  height: number;
  tiles: TileMap;
  highlights: string[];
  onPlace: (key: string, type: TileType) => void;
  onMove: (fromKey: string, toKey: string) => void;
  onRemove: (key: string) => void;
  onRotate: (key: string) => void;
}

function GridDropCell({
  id,
  hasTile,
  highlighted,
  children
}: {
  id: string;
  hasTile: boolean;
  highlighted: boolean;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`relative aspect-square rounded-2xl border p-0.5 ${
        isOver ? "border-blue-500 bg-blue-200" : "border-white/80 bg-white/50"
      } ${highlighted ? "ring-4 ring-amber-400" : ""}`}
    >
      {!hasTile ? <div className="h-full w-full rounded-xl bg-white/60" /> : null}
      {children}
    </div>
  );
}

function DraggablePlacedTile({
  tileKey,
  children
}: {
  tileKey: string;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `placed-${tileKey}`,
    data: {
      source: "placed",
      tileKey
    }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`h-full w-full ${isDragging ? "opacity-0" : "opacity-100"}`}
    >
      {children}
    </div>
  );
}

export function BuilderCanvas({
  width,
  height,
  tiles,
  highlights,
  onPlace,
  onMove,
  onRemove,
  onRotate
}: BuilderCanvasProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const highlightSet = new Set(highlights);
  const [dragPreviewTile, setDragPreviewTile] = useState<TileModel | null>(null);

  function onDragStart(event: DragStartEvent) {
    const data = event.active.data.current as
      | { source: "palette"; tileType: TileType }
      | { source: "placed"; tileKey: string }
      | undefined;

    if (!data) {
      setDragPreviewTile(null);
      return;
    }

    if (data.source === "palette") {
      setDragPreviewTile({ type: data.tileType, rot: 0 });
      return;
    }

    if (data.source === "placed") {
      setDragPreviewTile(tiles[data.tileKey] ?? null);
    }
  }

  function onDragCancel(_event: DragCancelEvent) {
    setDragPreviewTile(null);
  }

  function onDragEnd(event: DragEndEvent) {
    const activeData = event.active.data.current as
      | { source: "palette"; tileType: TileType }
      | { source: "placed"; tileKey: string }
      | undefined;

    const overId = event.over?.id?.toString();
    setDragPreviewTile(null);

    if (!activeData || !overId) {
      return;
    }

    if (overId === "trash-zone" && activeData.source === "placed") {
      onRemove(activeData.tileKey);
      return;
    }

    if (!overId.startsWith("cell-")) {
      return;
    }

    const targetKey = overId.replace("cell-", "");

    if (activeData.source === "palette") {
      if (!tiles[targetKey]) {
        onPlace(targetKey, activeData.tileType);
      }
      return;
    }

    if (activeData.source === "placed") {
      if (activeData.tileKey === targetKey) {
        return;
      }
      if (!tiles[targetKey]) {
        onMove(activeData.tileKey, targetKey);
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragCancel={onDragCancel}
      onDragEnd={onDragEnd}
    >
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <TilePalette />
        <div>
          <div
            className="grid gap-1 rounded-3xl bg-sky-200/70 p-3 shadow-xl"
            style={{
              gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: width * height }).map((_, idx) => {
              const x = idx % width;
              const y = Math.floor(idx / width);
              const key = coordToKey({ x, y });
              const tile = tiles[key];

              return (
                <GridDropCell
                  key={key}
                  id={`cell-${key}`}
                  hasTile={Boolean(tile)}
                  highlighted={highlightSet.has(key)}
                >
                  {tile ? (
                    <DraggablePlacedTile tileKey={key}>
                      <Tile tile={tile} highlighted={highlightSet.has(key)} onClick={() => onRotate(key)} />
                    </DraggablePlacedTile>
                  ) : null}
                </GridDropCell>
              );
            })}
          </div>

          <TrashZone />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {dragPreviewTile ? (
          <div className="h-16 w-16">
            <Tile tile={dragPreviewTile} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function TrashZone() {
  const { setNodeRef, isOver } = useDroppable({ id: "trash-zone" });

  return (
    <div
      ref={setNodeRef}
      className={`mt-4 rounded-3xl border-4 border-dashed p-5 text-center text-lg font-black transition ${
        isOver
          ? "border-rose-500 bg-rose-200 text-rose-800"
          : "border-rose-300 bg-rose-100/80 text-rose-700"
      }`}
    >
      Drop Here To Remove Tile
    </div>
  );
}
