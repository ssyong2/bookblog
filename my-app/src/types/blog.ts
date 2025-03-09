export interface BlogPost {
  id: string;
  title: string;
  content: string;
  thumbnailImage?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  content: string;
  thumbnailImage?: string;
  images: string[];
} 