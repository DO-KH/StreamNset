import { NextRequest, NextResponse } from "next/server";
import { getBestThumbnail } from "@/utils/youtube";
import { fetchChannelProfiles } from "@/libs/fetch-chnnel-profile";
import { YouTubeVideoItem, YouTubeVideo } from "@/types/youtube";

export async function GET(req: NextRequest) {
  const pageToken = req.nextUrl.searchParams.get("pageToken");
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY as string;

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=20&key=${API_KEY}${
    pageToken ? `&pageToken=${pageToken}` : ""
  }`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.items) {
    return NextResponse.json({ videos: [], nextPageToken: null });
  }

  const channelIds: string[] = Array.from(
    new Set(
      data.items
        .map((item: YouTubeVideoItem) => item.snippet.channelId)
        .filter((id: string): id is string => typeof id === "string")
    )
  );

  const channelProfiles = await fetchChannelProfiles(channelIds, API_KEY);

  const videos: YouTubeVideo[] = data.items.map((item: YouTubeVideoItem) => ({
    videoId: item.id,
    title: item.snippet.title,
    thumbnail: getBestThumbnail(item.snippet.thumbnails),
    channelName: item.snippet.channelTitle,
    viewCount: item.statistics?.viewCount || "0",
    channelProfile:
      channelProfiles[item.snippet.channelId] ||
      "https://via.placeholder.com/50x50",
    publishedAt: item.snippet.publishedAt,
  }));

  return NextResponse.json({
    videos,
    nextPageToken: data.nextPageToken ?? null,
  });
}
