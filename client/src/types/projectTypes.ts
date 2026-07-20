export interface createProjectType {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
}

export interface projectType {
  id: string;

  name: string;

  description: string | null;

  thumbnail_url: string | null;

  created_at: string;

  updated_at: string;
}
