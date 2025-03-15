import { YouTubeVideoItem } from "@/types/youtube";

export function getBestThumbnail(
  thumbnails?: YouTubeVideoItem["snippet"]["thumbnails"]
): string {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    "https://via.placeholder.com/480x270"
  );
}