import { YouTubeVideoResponse } from "@/types/youtube";

export async function fetchLikedVideos(
  accessToken: string,
  pageToken?: string
): Promise<YouTubeVideoResponse> {
  let url = "";

  if (typeof window === "undefined") {
    // 서버
    const { headers } = await import("next/headers");
    const host = (await headers()).get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    url = `${protocol}://${host}/api/youtube/liked?accessToken=${accessToken}${
      pageToken ? `&pageToken=${pageToken}` : ""
    }`;
  } else {
    // 클라이언트
    const host = window.location.host;
    const protocol = window.location.protocol;
    url = `${protocol}//${host}/api/youtube/liked?accessToken=${accessToken}${
      pageToken ? `&pageToken=${pageToken}` : ""
    }`;
  }

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) throw new Error("🔥 YouTube API 요청 실패");

    const { videos, nextPageToken } = await res.json();
    return { videos, nextPageToken };
  } catch (e) {
    console.error("영상을 불러오는데 실패했습니다.", e);
    return { videos: [], nextPageToken: null };
  }
}
