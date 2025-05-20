import { getBestThumbnail } from "@/utils/youtube";
import { YouTubeVideoItem } from "@/types/youtube";
import { NextRequest, NextResponse } from "next/server";

export interface SearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
    publishedAt: string;
  };
  statistics: {
    viewCount?: string;
    likeCount?: string;
  };
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  const pageToken = req.nextUrl.searchParams.get("pageToken") ?? "";
  const order = req.nextUrl.searchParams.get("order") ?? "relevance";
  if (!query) return NextResponse.json([], { status: 200 });

  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  // 검색 API 호출 (영상 ID 및 기본 정보 가져오기)
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=20&type=video&order=${order}&key=${API_KEY}${pageToken ? `&pageToken=${pageToken}` : ""}`;
  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();

  console.log("📌 검색 API 응답 데이터:", searchData);

  if (!searchData.items)
    return NextResponse.json(
      { message: "검색 결과를 찾을 수 없습니다" },
      { status: 404 }
    );

  // 2️⃣ 📌 videoId 목록 추출
  const videoIds = searchData.items
    .map((item: SearchItem) => item.id.videoId)
    .join(",");

  // 3️⃣ 📊 조회수 가져오기 (videos API 호출)
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`;
  const videosResponse = await fetch(videosUrl);
  const videosData = await videosResponse.json();

  console.log("📊 Videos API 응답 데이터:", videosData);

  // 4️⃣ 조회수 데이터를 매핑
  const videoStats: Record<string, string> = {};
  videosData.items.forEach((video: YouTubeVideoItem) => {
    videoStats[video.id] = video.statistics?.viewCount || "0";
  });

  // 5️⃣ 최종 데이터 반환 (조회수 포함)
  const result = searchData.items.map((item: SearchItem) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    thumbnail: getBestThumbnail(item.snippet.thumbnails),
    channelName: item.snippet.channelTitle,
    viewCount: videoStats[item.id.videoId] || "0", // ✅ 조회수 추가
    channelProfile:
      item.snippet.thumbnails.default?.url ||
      "https://via.placeholder.com/50x50",
    publishedAt: item.snippet.publishedAt,
  }));

  return NextResponse.json({
    videos: result,
    nextPageToken: searchData.nextPageToken ?? null
  });
}
