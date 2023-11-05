export interface OEmbedResponseDto {
  width: number;
  author_name: string;
  author_url: string;
  version: number;
  provider_url: string;
  provider_name: string;
  thumbnail_width: number;
  thumbnail_url: string;
  height: number;
  thumbnail_height: number;
  html: string;
  url: string;
  type: string;
  title: string;
}

export interface OEmbedError {
  url: string;
  error: string;
}
