import { getBestThumbnail } from "@/utils/youtube";
import { fetchChannelProfiles } from "@/libs/fetch-chnnel-profile";
import { YouTubeVideoItem } from "@/types/youtube";
import { NextRequest, NextResponse } from "next/server";

interface VideoDetails {
  viewCount: string;
  publishedAt: string;
  channelId: string;
}

export async function GET(req: NextRequest) {
  const accessToken = req.nextUrl.searchParams.get("accessToken");
  const pageToken = req.nextUrl.searchParams.get("pageToken") || "";
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY as string;

  console.log(accessToken);

  // 1️⃣ 좋아요한 영상 목록 가져오기 (영상 ID 포함)
  const likedVideosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&myRating=like&maxResults=20&key=${API_KEY}${
    pageToken ? `&pageToken=${pageToken}` : ""
  }`;
  const likedVideosResponse = await fetch(likedVideosUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const likedVideosData = await likedVideosResponse.json();

  if (!likedVideosData.items) {
    console.error("❌ Error: No liked videos found");
    return NextResponse.json({ videos: [], nextPageToken: null });
  }

  // 2️⃣ videoId, 채널 ID 목록 추출
  const videoDetails: Record<
    string,
    { viewCount: string; publishedAt: string; channelId: string }
  > = {};

  const channelIds: string[] = Array.from(
    new Set(
      likedVideosData.items
        .map((video: YouTubeVideoItem) => video.snippet.channelId)
        .filter((id: string): id is string => typeof id === "string")
    )
  );

  likedVideosData.items.forEach((video: YouTubeVideoItem) => {
    videoDetails[video.id] = {
      viewCount: video.statistics?.viewCount || "0",
      publishedAt: video.snippet.publishedAt,
      channelId: video.snippet.channelId,
    };
  });

  // 3️⃣ 채널 프로필 가져오기
  const channelProfiles = await fetchChannelProfiles(channelIds, API_KEY);

  // 4️⃣ 최종 데이터 반환
  const videos = likedVideosData.items.map((video: YouTubeVideoItem) => {
    const videoId = video.id;
    const details: VideoDetails = videoDetails[videoId] || {
      viewCount: "0",
      publishedAt: "",
      channelId: "",
    };

    return {
      videoId,
      title: video.snippet.title,
      thumbnail: getBestThumbnail(video.snippet.thumbnails),
      channelName: video.snippet.channelTitle,
      viewCount: details.viewCount,
      publishedAt: details.publishedAt,
      channelProfile:
        channelProfiles[details.channelId] ||
        "https://via.placeholder.com/50x50",
    };
  });

  return NextResponse.json({
    videos,
    nextPageToken: likedVideosData.nextPageToken ?? null,
  });
}
