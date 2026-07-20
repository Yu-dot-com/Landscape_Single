export interface Point2D {
  x: number;
  y: number;
}

export interface AssetTemplate {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  imagePath?: string;
  width: number;
  height: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  // Blueprint for vector shapes
  defaultPoints?: Point2D[];
}

export interface PlacedItem {
  id: string;
  asset_id: string;
  name: string;
  category: string;
  subCategory: string;
  x: number;
  y: number;
  z_index: number;
  width: number;
  height: number;
  rotation: number;
  color?: string; // Custom color for walls
  points?: Point2D[]; // Interactive vertices
}

export interface DesignState {
  activeCategory: string | null;
  placedItems: PlacedItem[];
  activePlacedItemId: string | null;
  setActiveCategory: (category: string | null) => void;
  lastSavedPlacedItems: PlacedItem[];
  setLastSavedPlacedItems:(items:PlacedItem[])=>void;
  setPlacedItems:(items:PlacedItem[])=>void;
  setActivePlacedItemId: (id: string | null) => void;
  addItemToCanvasById: (
    template: AssetTemplate,
    x: number,
    y: number,
    w?: number,
    h?: number,
    r?: number,
  ) => void;
  updateItemPosition: (id: string, x: number, y: number) => void;
  updateItemRotation: (id: string, rotation: number) => void;
  updateItemScale: (id: string, width: number, height: number) => void;
  updateItemColor: (id: string, color: string) => void;
  updateWallVertex: (id: string, index: number, x: number, y: number) => void;
  updateWallEdge: (
    id: string,
    index1: number,
    index2: number,
    dx: number,
    dy: number,
  ) => void;
  bringToFront?: (id: string | null) => void;
  bringToBack?: (id: string | null) => void;
  deleteItem?: (id: string) => void;
}
