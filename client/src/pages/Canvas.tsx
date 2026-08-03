import { memo, useCallback, useEffect, useMemo, useRef } from "react";

import {
  Stage,
  Layer,
  Group,
  Image as KonvaImage,
  Rect,
  Transformer,
  Text,
  Circle,
} from "react-konva";

import { useDesignStore } from "../stores/useDesignStore";
import type { AssetTemplate, PlacedItem } from "../types/assetTypes";

import useImage from "use-image";
import Konva from "konva";

import { useGetAsset } from "../hooks/useAsset";

import {
  clearEditing,
  setEditing,
  setSelectedItem,
} from "../collaboration/Awareness";

import { useAwareness } from "../hooks/useAwareness";
import { useCanvasItems } from "../collaboration/CanvasSynce";
import { registerCanvasStage } from "../utils/exportCanvas";

// ============================================================
// TYPES
// ============================================================

interface RemoteUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface CanvasItemProps {
  item: PlacedItem;
  template: AssetTemplate;
  isSelected: boolean;
  onSelect: () => void;
  remoteUsers: RemoteUser[];
}

// ============================================================
// STANDARD ITEM
// ============================================================

const StandardItem = memo(function StandardItem({
  item,
  template,
  isSelected,
  onSelect,
  remoteUsers,
}: CanvasItemProps) {
  const [image, status] = useImage(template.imagePath || "", "anonymous");

  const shapeRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  // ----------------------------------------------------------
  // Attach / detach transformer
  // ----------------------------------------------------------

  useEffect(() => {
    const transformer = transformerRef.current;
    const node = shapeRef.current;

    if (!transformer || !node) {
      return;
    }

    if (isSelected) {
      transformer.nodes([node]);
    } else {
      transformer.nodes([]);
    }

    transformer.getLayer()?.batchDraw();
  }, [isSelected]);

  // ----------------------------------------------------------
  // Drag Start
  // ----------------------------------------------------------

  const handleDragStart = useCallback(() => {
    useDesignStore.getState().setActivePlacedItemId(item.id);

    setSelectedItem(item.id);

    setEditing(item.id, "position");
  }, [item.id]);

  // ----------------------------------------------------------
  // Drag End
  // ----------------------------------------------------------

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target;

      useDesignStore.getState().updateItemPosition(item.id, node.x(), node.y());

      clearEditing();
    },
    [item.id],
  );

  // ----------------------------------------------------------
  // Transform
  // ----------------------------------------------------------

  const handleTransform = useCallback(() => {
    setEditing(item.id, "transform");
  }, [item.id]);

  // ----------------------------------------------------------
  // Transform End — no min/max clamping, resize is free
  // ----------------------------------------------------------

  const handleTransformEnd = useCallback(() => {
    const node = shapeRef.current;

    if (!node) {
      return;
    }

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const newWidth = item.width * scaleX;
    const newHeight = item.height * scaleY;

    // Reset Konva scale.
    // The actual width/height are persisted to Yjs.
    node.scaleX(1);
    node.scaleY(1);

    const store = useDesignStore.getState();

    store.updateItemScale(item.id, newWidth, newHeight);

    store.updateItemRotation(item.id, node.rotation());

    clearEditing();
  }, [item.id, item.width, item.height]);
  const USER_COLORS = [
  '#F04438', '#F79009', '#7A5AF8', '#2E90FA',
  '#12B76A', '#EE46BC', '#6938EF', '#F63D68',
];

function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}
function getUserInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

  return (
    <>
      <Group
        ref={shapeRef}
        x={item.x}
        y={item.y}
        rotation={item.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={handleDragStart}
        onDragMove={handleDragEnd}
        onDragEnd={handleDragEnd}
        onTransform={handleTransform}
        onTransformEnd={handleTransformEnd}
      >
        {/* ==================================================
            REMOTE USER SELECTION
        ================================================== */}
{remoteUsers.length > 0 && (() => {
  // Compute once — avoids repeating remoteUsers[remoteUsers.length - 1]
  // and the undefined user reference from before
  const activeUser = remoteUsers[remoteUsers.length - 1];
  const activeColor =  getUserColor(activeUser.id);

  return (
    <>
      {/* Selection outline — solid, color-coded to the most recent editor,
          with a soft glow instead of a dashed "pending" look */}
      <Rect
        x={-item.width / 2 - 4}
        y={-item.height / 2 - 4}
        width={item.width + 8}
        height={item.height + 8}
        stroke={activeColor}
        strokeWidth={2}
        cornerRadius={4}
        listening={false}
        shadowColor={activeColor}
        shadowBlur={10}
        shadowOpacity={0.4}
        shadowForStrokeEnabled={false}
        zindex={1000}
      />

      {/* Presence cluster — avatar stack + name tag, anchored above the item */}
      <Group x={-item.width / 2} y={-item.height / 2 - 34} listening={false}>

        {/* Avatar stack (max 3 visible, then overflow badge) */}
        {remoteUsers.slice(0, 3).map((user, index) => {
          const color =  getUserColor(user.id);
          return (
            <Group key={user.id} x={index * 20} y={0}>
              <Circle
                radius={12}
                fill={color}
                stroke="white"
                strokeWidth={2}
                shadowColor="black"
                shadowBlur={4}
                shadowOpacity={0.18}
                shadowOffsetY={1}
              />
              <Text
                text={getUserInitials(user.username)}
                width={24}
                height={24}
                offsetX={12}
                offsetY={12}
                align="center"
                verticalAlign="middle"
                fontSize={10}
                fontStyle="600"
                fontFamily="IBM Plex Sans"
                fill="white"
                zindex={10000}
              />
            </Group>
          );
        })}

        {remoteUsers.length > 3 && (
          <Group x={3 * 20} y={0}>
            <Circle
              radius={12}
              fill="#475467"
              stroke="white"
              strokeWidth={2}
            />
            <Text
              text={`+${remoteUsers.length - 3}`}
              width={24}
              height={24}
              offsetX={12}
              offsetY={12}
              align="center"
              verticalAlign="middle"
              fontSize={9}
              fontFamily="IBM Plex Sans"
              fill="white"
            />
          </Group>
        )}

        {/* Name tag for the active editor */}
        <Group x={0} y={28}>
          <Rect
            width={Math.max(60, activeUser.username.length * 6.5 + 20)}
            height={20}
            fill={activeColor}
            cornerRadius={4}
            shadowColor="black"
            shadowBlur={4}
            shadowOpacity={0.2}
            shadowOffsetY={1}
          />
          <Text
            text={activeUser.username}
            fontSize={11}
            fontFamily="IBM Plex Sans"
            fontStyle="500"
            fill="white"
            padding={5}
          />
        </Group>
      </Group>
    </>
  );
})()}
        {/* ==================================================
            ACTUAL ASSET
        ================================================== */}

        {status === "loaded" && image ? (
          <KonvaImage
            image={image}
            width={item.width}
            height={item.height}
            offsetX={item.width / 2}
            offsetY={item.height / 2}
          />
        ) : (
          <Rect
            width={item.width}
            height={item.height}
            offsetX={item.width / 2}
            offsetY={item.height / 2}
            fill="#e5e7eb"
            stroke="#9ca3af"
            strokeWidth={1}
          />
        )}
      </Group>

      {/* ====================================================
          TRANSFORMER — no boundBoxFunc, resize is unrestricted
      ==================================================== */}

      {isSelected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled
          enabledAnchors={[
            "top-left",
            "top-center",
            "top-right",
            "middle-left",
            "middle-right",
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ]}
        />
      )}
    </>
  );
});

// ============================================================
// MAIN CANVAS
// ============================================================

export default function Canvas() {
  const stageRef = useRef<Konva.Stage>(null);

  // ==========================================================
  // YJS ITEMS
  // ==========================================================

  const items = useCanvasItems();

  // ==========================================================
  // ASSET CATALOG
  // ==========================================================

  const { data, isLoading } = useGetAsset();

  const catalog = useMemo(
    () => (data as unknown as AssetTemplate[]) || [],
    [data],
  );

  const catalogById = useMemo(() => {
    const map = new Map<string, AssetTemplate>();

    for (const asset of catalog) {
      map.set(asset.id, asset);
    }

    return map;
  }, [catalog]);

  // ==========================================================
  // DESIGN STORE
  // ==========================================================

  const activePlacedItemId = useDesignStore(
    (state) => state.activePlacedItemId,
  );

  const setActivePlacedItemId = useDesignStore(
    (state) => state.setActivePlacedItemId,
  );

  const addItemToCanvasById = useDesignStore(
    (state) => state.addItemToCanvasById,
  );

  // ==========================================================
  // AWARENESS
  // ==========================================================

  const { states, localClientId } = useAwareness();

  // ==========================================================
  // BUILD REMOTE SELECTION MAP
  // ==========================================================

  const remoteSelectionsByItemId = useMemo(() => {
    const map = new Map<string, RemoteUser[]>();

    for (const [clientId, state] of states.entries()) {
      // Ignore my own awareness state
      if (clientId === localClientId) {
        continue;
      }

      if (!state.selectedItemId || !state.user) {
        continue;
      }

      const itemId = state.selectedItemId;

      const existingUsers = map.get(itemId) ?? [];

      existingUsers.push(state.user);

      map.set(itemId, existingUsers);
    }

    return map;
  }, [states, localClientId]);

  // ==========================================================
  // SORT ITEMS BY Z-INDEX
  // ==========================================================

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => (a.z_index ?? 0) - (b.z_index ?? 0));
  }, [items]);

  // ==========================================================
  // SELECT ITEM
  // ==========================================================

  const handleSelect = useCallback(
    (itemId: string) => {
      setActivePlacedItemId(itemId);

      setSelectedItem(itemId);
    },
    [setActivePlacedItemId],
  );

  // ==========================================================
  // DROP ASSET
  // ==========================================================

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      const stage = stageRef.current;

      if (!stage) {
        return;
      }

      const assetId = e.dataTransfer.getData("text/plain");

      if (!assetId) {
        return;
      }

      stage.setPointersPositions(e);

      const pointer = stage.getPointerPosition();

      if (!pointer) {
        return;
      }

      const scale = stage.scaleX();

      const x = (pointer.x - stage.x()) / scale;

      const y = (pointer.y - stage.y()) / scale;

      const template = catalogById.get(assetId);

      if (!template) {
        console.warn("Asset template not found:", assetId);

        return;
      }

      addItemToCanvasById(template, x, y);
    },
    [catalogById, addItemToCanvasById],
  );

  // ==========================================================
  // CLICK EMPTY CANVAS
  // ==========================================================

const handleStageMouseDown = useCallback(
  (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage()) {
      setActivePlacedItemId(null);
      setSelectedItem(null);
    }
  },
  [setActivePlacedItemId],
);

  useEffect(() => {
    return () => {
      registerCanvasStage(null);
    };
  }, []);

  // ==========================================================
  // ZOOM
  // ==========================================================

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const oldScale = stage.scaleX();

    const pointer = stage.getPointerPosition();

    if (!pointer) {
      return;
    }

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,

      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? 1 : -1;

    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    const scaleBy = 1.03;

    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({
      x: newScale,
      y: newScale,
    });

    stage.position({
      x: pointer.x - mousePointTo.x * newScale,

      y: pointer.y - mousePointTo.y * newScale,
    });
  }, []);

if (isLoading) {
  return (
    <div className="w-full h-full bg-canvas-grid flex flex-col items-center justify-center">
      <div className="relative w-11 h-11 mb-5">
        <div className="absolute inset-0 rounded-full border-[3px] border-border" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#6B7A58] animate-spin" />
      </div>

      <p className="text-sm font-medium text-text-main tracking-wide">
        Loading canvas
      </p>

      <div className="flex gap-1.5 mt-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A58]/50 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A58]/50 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A58]/50 animate-bounce" />
      </div>
    </div>
  );
}

  return (
    <div
      className="w-full h-full bg-canvas-grid overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Stage
        ref={(node) => {
          stageRef.current = node;
          registerCanvasStage(node);
        }}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleStageMouseDown}
        onTouchStart={handleStageMouseDown}
        onWheel={handleWheel}
        draggable
      >
        <Layer>
          {sortedItems.map((item) => {
            const template = catalogById.get(item.asset_id);

            if (!template) {
              return null;
            }

            const remoteUsers = remoteSelectionsByItemId.get(item.id) ?? [];

            const isSelected = item.id === activePlacedItemId;

            return (
              <StandardItem
                key={item.id}
                item={item}
                template={template}
                isSelected={isSelected}
                onSelect={() => handleSelect(item.id)}
                remoteUsers={remoteUsers}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}