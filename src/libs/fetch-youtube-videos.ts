import { getBestThumbnail } from "@/utils/youtube";
import { fetchChannelProfiles } from "./fetch-chnnel-profile"; // ✅ 모듈화한 채널 프로필 API import
import { YouTubeVideo, YouTubeVideoItem } from "@/types/youtube";

export async function fetchYouTubeVideos() {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY as string;
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=20&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.items) return [];


  // ✅ 모든 채널 ID를 중복 없이 가져오기
  const channelIds: string[] = Array.from(
    new Set(
      data.items
        .map((item: YouTubeVideoItem) => item.snippet.channelId)
        .filter((id: string | undefined): id is string => typeof id === "string")
    )
  );

  // ✅ 채널 프로필을 가져옴
  const channelProfiles = await fetchChannelProfiles(channelIds, API_KEY);

  return data.items.map((item: YouTubeVideoItem): YouTubeVideo => ({
    videoId: item.id,
    title: item.snippet.title,
    thumbnail: getBestThumbnail(item.snippet.thumbnails),
    channelName: item.snippet.channelTitle,
    viewCount: item.statistics?.viewCount || "0",
    channelProfile: channelProfiles[item.snippet.channelId] || "https://via.placeholder.com/50x50",
    publishedAt: item.snippet.publishedAt,
  }));
}
