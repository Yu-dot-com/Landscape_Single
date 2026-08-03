import { getItemsMap } from "./yjs";
import type { PlacedItem } from "../types/assetTypes";
import { useEffect, useState } from "react";

let animationFrame: number | null = null;

const pendingPositions = new Map<
  string,
  {
    x: number;
    y: number;
  }
>();



export function loadItemsToYjs(items: PlacedItem[]) {
  const itemsMap = getItemsMap();

  // Already initialized for this room
  if (itemsMap.size > 0) {
    return;
  }

  items.forEach((item) => {
    itemsMap.set(item.id, item);
  });
}
export function useCanvasItems() {
  const [items, setItems] = useState<PlacedItem[]>([]);

  useEffect(() => {
    let itemsMap;

    try {
      itemsMap = getItemsMap();
    } catch (error) {
      console.warn(
        "[CanvasSync] Yjs room is not initialized yet.",
      );

      return;
    }

    const sync = () => {
      setItems(
        Array.from(itemsMap.values()) as PlacedItem[],
      );
    };

    // Initial sync
    sync();

    // Listen for local + remote Yjs changes
    itemsMap.observe(sync);

    return () => {
      itemsMap.unobserve(sync);
    };
  }, []);

  return items;
}

export function updateItemPositionThrottled(
  id: string,
  x: number,
  y: number
) {
  pendingPositions.set(id, { x, y });

  if (animationFrame !== null) {
    return;
  }

  animationFrame = requestAnimationFrame(() => {
    const itemsMap = getItemsMap();

    pendingPositions.forEach(({ x, y }, id) => {
      const item = itemsMap.get(id);

      if (!item) return;

      itemsMap.set(id, {
        ...item,
        x,
        y,
      });
    });

    pendingPositions.clear();
    animationFrame = null;
  });
}