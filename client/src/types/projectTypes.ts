export interface createProjectType {
  name: string;
  description?: string;
  thumbnail_url?: string;
}

export interface projectType {
  id: string;

  name: string;

  description: string | null;

  thumbnail_url: string | null;

  created_at: string;

  updated_at: string;

  collaborators: [] 
}

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
  color:string|undefined;  
  points?: Point2D[];   // Interactive vertices
}