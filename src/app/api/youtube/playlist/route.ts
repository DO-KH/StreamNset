import { fetchChannelProfiles } from "@/libs/fetch-chnnel-profile"; // ✅ 채널 프로필 가져오기
import { NextRequest, NextResponse } from "next/server";

interface PlaylistItem {
  snippet: {
    title: string;
    resourceId: { videoId: string };
    thumbnails: { high: { url: string } };
    videoOwnerChannelTitle: string;
  };
}

interface VideoItem {
  id: string;
  snippet: {
    channelId: string;
    publishedAt: string;
  };
  statistics: { viewCount?: string };
}

export async function GET(req: NextRequest) {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY as string;
  const playlistId = req.nextUrl.searchParams.get("playlistId");
  const pageToken = req.nextUrl.searchParams.get("pageToken");

  console.log("📌 Fetching Playlist Videos for ID:", playlistId);

  // 1️⃣ 플레이리스트에서 영상 목록 가져오기
  const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=20&key=${API_KEY}${
    pageToken ? `&pageToken=${pageToken}` : ""
  }`;
  const playlistResponse = await fetch(playlistUrl);
  const playlistData = await playlistResponse.json();

  if (!playlistData.items) {
    console.error("❌ Error: No items in Playlist API Response");
    return NextResponse.json(
      { message: "해당 플레이리스트를 찾을 수 없습니다." },
      { status: 404 } // ✅ 의미 있는 상태 코드
    );
  }

  // videoId 목록 추출
  const videoIds = playlistData.items.map(
    (item: PlaylistItem) => item.snippet.resourceId.videoId
  );

  // videos API를 사용해 조회수 및 추가 정보 가져오기
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(
    ","
  )}&key=${API_KEY}`;
  const videosResponse = await fetch(videosUrl);
  const videosData = await videosResponse.json();

  console.log("Videos API Response:", videosData);

  // 조회수, 업로드 날짜 및 채널 ID 데이터를 매핑
  const videoDetails: Record<
    string,
    { viewCount: string; publishedAt: string; channelId: string }
  > = {};

  videosData.items.forEach((video: VideoItem) => {
    videoDetails[video.id] = {
      viewCount: video.statistics.viewCount || "0",
      publishedAt: video.snippet.publishedAt,
      channelId: video.snippet.channelId,
    };
  });

  // 채널 ID 목록 추출 (`undefined` 값 제거)
  const channelIds: string[] = Array.from(
    new Set( // set을 통해 반환된 값의 타입은
      videosData.items
        .map((video: VideoItem) => video.snippet.channelId) // ✅ 타입 명확화
        .filter((id: string): id is string => typeof id === "string") // ✅ `undefined` 제거 후 `string`으로 강제 변환
    )
  );

  // 채널 프로필 가져오기
  const channelProfiles = await fetchChannelProfiles(channelIds, API_KEY);

  const playlists = playlistData.items.map((item: PlaylistItem) => {
    const videoId = item.snippet.resourceId.videoId;
    const details = videoDetails[videoId] || {
      viewCount: "0",
      publishedAt: "",
      channelId: "",
    };

    return {
      videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      channelName: item.snippet.videoOwnerChannelTitle,
      viewCount: details.viewCount,
      publishedAt: details.publishedAt, // ✅ 업로드 날짜 추가
      channelProfile:
        channelProfiles[details.channelId] ||
        "https://via.placeholder.com/50x50", // ✅ 채널 프로필 추가
    };
  });
  return NextResponse.json({
    videos: playlists,
    nextPageToken: playlistData.nextPageToken ?? null,
  });
}
