import { getBestThumbnail } from "@/utils/youtube";
import { fetchChannelProfiles } from "./fetch-chnnel-profile"; // ✅ 모듈화한 채널 프로필 API import

export async function fetchYouTubeVideoById(videoId: string) {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY as string;
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.items || data.items.length === 0) return null;

  const video = data.items[0];

  // ✅ 개별 영상의 채널 ID 가져오기
  const channelId = video.snippet.channelId;

  // ✅ 채널 프로필 가져오기
  const channelProfiles = await fetchChannelProfiles([channelId], API_KEY);

  return {
    videoId: video.id,
    title: video.snippet.title,
    thumbnail: getBestThumbnail(video.snippet.thumbnails),
    channelName: video.snippet.channelTitle,
    viewCount: video.statistics.viewCount || "0",
    likeCount: video.statistics.likeCount || "0", // ✅ 좋아요 수 추가
    channelProfile: channelProfiles[channelId] || "https://via.placeholder.com/50x50",
    publishedAt: video.snippet.publishedAt,
  };
}
