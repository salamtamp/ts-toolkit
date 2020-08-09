export interface Credential {
  clientId: string;
  clientSecret: string;
}

export interface Video {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  description: string;
  created_at: string;
  published_at: string;
  url: string;
  thumbnail_url: string;
  viewable: string;
  view_count: number;
  language: string;
  type: string;
  duration: string;
}

export interface VideoListResult {
  data: Video[];
  next: string | null;
}
