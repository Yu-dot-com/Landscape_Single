import { create } from "zustand";
import type {
  DesignState,
  PlacedItem,
} from "../types/assetTypes";

export const useDesignStore = create<DesignState>((set, get) => ({
  activeCategory: null,
  placedItems: [],
  activePlacedItemId: null,
  lastSavedPlacedItems: [],
  setActiveCategory: (category) => set({ activeCategory: category }),
  setActivePlacedItemId: (id) => set({ activePlacedItemId: id }),
  setLastSavedPlacedItems: (items) => set({ lastSavedPlacedItems: JSON.parse(JSON.stringify(items)) }),
  setPlacedItems: (items) => set({ placedItems: items, lastSavedPlacedItems: items }),
  addItemToCanvasById: (template, x, y, w, h, r) => {

    const { placedItems } = get();

    const maxZ =
      placedItems.length === 0
        ? 0
        : Math.max(...placedItems.map((item) => item.z_index ?? 0));

    const newItem: PlacedItem = {
      id: crypto.randomUUID(),
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

    set((state) => ({
      placedItems: [...state.placedItems, newItem],
      activePlacedItemId: newItem.id,
    }));
  },

  updateItemPosition: (id, x, y) =>
    set((state) => ({
      placedItems: state.placedItems.map((item) =>
        item.id === id ? { ...item, x, y } : item,
      ),
    })),

  updateItemRotation: (id, rotation) =>
    set((state) => ({
      placedItems: state.placedItems.map((item) =>
        item.id === id ? { ...item, rotation } : item,
      ),
    })),

  updateItemScale: (id, width, height) =>
    set((state) => ({
      placedItems: state.placedItems.map((item) =>
        item.id === id ? { ...item, width, height } : item,
      ),
    })),

  updateItemColor: (id, color) =>
    set((state) => ({
      placedItems: state.placedItems.map((item) =>
        item.id === id ? { ...item, color } : item,
      ),
    })),

  updateWallVertex: (id, index, x, y) =>
    set((state) => ({
      placedItems: state.placedItems.map((item) => {
        if (item.id !== id || !item.points) return item;
        const newPoints = [...item.points];
        newPoints[index] = { x, y };
        return { ...item, points: newPoints };
      }),
    })),

  bringToFront: (id) => {
    if (!id) return;
    set((state) => {
      if (state.placedItems.length === 0) return {};
      const maxZ = Math.max(
        ...state.placedItems.map((item) => item.z_index ?? 0),
      );
      return {
        placedItems: state.placedItems.map((item) =>
          item.id === id ? { ...item, z_index: maxZ + 1 } : item,
        ),
      };
    });
  },

  bringToBack: (id) => {
    if (!id) return;
    set((state) => {
      if (state.placedItems.length === 0) return {};
      const minZ = Math.min(
        ...state.placedItems.map((item) => item.z_index ?? 0),
      );
      return {
        placedItems: state.placedItems.map((item) =>
          item.id === id ? { ...item, z_index: minZ - 1 } : item,
        ),
      };
    });
  },

  deleteItem: (id) => {
    set((state) => ({
      placedItems: state.placedItems.filter((item) => item.id !== id),
      activePlacedItemId:
        state.activePlacedItemId === id ? null : state.activePlacedItemId,
    }));
  },

  updateWallEdge: (id, index1, index2, dx, dy) =>
    set((state) => ({
      placedItems: state.placedItems.map((item) => {
        if (item.id !== id || !item.points) return item;

        const newPoints = [...item.points];
        newPoints[index1] = {
          x: newPoints[index1].x + dx,
          y: newPoints[index1].y + dy,
        };
        newPoints[index2] = {
          x: newPoints[index2].x + dx,
          y: newPoints[index2].y + dy,
        };

        return { ...item, points: newPoints };
      }),
    })),
}));
