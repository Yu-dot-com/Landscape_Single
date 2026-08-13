import { create } from "zustand";
import type {
  AssetTemplate,
  DesignState,
  PlacedItem,
} from "../types/assetTypes";
import { getItemsMap } from "../collaboration/yjs";
import { v4 as uuidv4 } from 'uuid';

export const useDesignStore = create<DesignState>((set) => ({
  activeCategory: null,
  activePlacedItemId: null,

  setActiveCategory: (category) => set({ activeCategory: category }),
  setActivePlacedItemId: (id) => set({ activePlacedItemId: id }),

  addItemToCanvasById: (template: AssetTemplate, x, y, w, h, r) => {
    const itemsMap = getItemsMap();
    const items = Array.from(itemsMap.values()) as PlacedItem[];

    const maxZ =
      items.length === 0
        ? 0
        : Math.max(...items.map((item) => item.z_index ?? 0));

    if (!template) return null;

    const newItem: PlacedItem = {
      id: uuidv4(),
      asset_id: template.id,
      name: template.name,
      category: template.category,
      subCategory: template.subCategory,
      z_index: maxZ + 1,
      x,
      y,
      width: w ?? template.width,
      height: h ?? template.height,
      rotation: r ?? 0,
      color: template.category === "walls" ? "#64748b" : undefined,
      points: template.defaultPoints
        ? JSON.parse(JSON.stringify(template.defaultPoints))
        : undefined,
    };

    itemsMap.set(newItem.id, newItem);

    // Return the new item's id so callers (e.g. duplicate) can select it
    return newItem.id;
  },

  updateItemPosition: (id, x, y) => {
    const itemsMap = getItemsMap();
    const item = itemsMap.get(id);

    if (!item) return;

    itemsMap.set(id, {
      ...item,
      x,
      y,
    });
  },

  updateItemRotation: (id, rotation) => {
    const itemsMap = getItemsMap();
    const item = itemsMap.get(id);

    if (!item) return;

    itemsMap.set(id, {
      ...item,
      rotation,
    });
  },

  // No min/max clamping anymore — width/height are applied as-is
  updateItemScale: (id, width, height) => {
    const itemsMap = getItemsMap();
    const item = itemsMap.get(id);

    if (!item) return;

    itemsMap.set(id, {
      ...item,
      width,
      height,
    });
  },

  bringToFront: (id) => {
    const itemsMap = getItemsMap();
    if (!id) return;

    const items = Array.from(itemsMap.values());

    if (items.length === 0) return;

    const item = itemsMap.get(id);

    if (!item) return;

    const maxZ = Math.max(...items.map((i: any) => i.z_index ?? 0));

    itemsMap.set(id, {
      ...item,
      z_index: maxZ + 1,
    });
  },

  bringToBack: (id) => {
    const itemsMap = getItemsMap();
    if (!id) return;

    const items = Array.from(itemsMap.values());

    if (items.length === 0) return;

    const item = itemsMap.get(id);

    if (!item) return;

    const minZ = Math.min(...items.map((i: any) => i.z_index ?? 0));

    itemsMap.set(id, {
      ...item,
      z_index: minZ - 1,
    });
  },

  deleteItem: (id) => {
    const itemsMap = getItemsMap();
    itemsMap.delete(id);

    set((state) => ({
      activePlacedItemId:
        state.activePlacedItemId === id ? null : state.activePlacedItemId,
    }));
  },
}));