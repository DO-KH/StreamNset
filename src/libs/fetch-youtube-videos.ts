import { YouTubeVideoResponse } from "@/types/youtube";

export async function fetchYouTubeVideos(
  pageToken?: string
): Promise<YouTubeVideoResponse> {
  let url = "";

  if (typeof window === "undefined") {
    // 서버
    const { headers } = await import("next/headers");
    const host = (await headers()).get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    url = `${protocol}://${host}/api/youtube/main${
      pageToken ? `?pageToken=${pageToken}` : ""
    }`;
  } else {
    // 클라이언트
    const host = window.location.host;
    const protocol = window.location.protocol;
    url = `${protocol}//${host}/api/youtube/main${
      pageToken ? `?pageToken=${pageToken}` : ""
    }`;
  }

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error("🔥 YouTube API 요청 실패");
  }

  const { videos, nextPageToken } = await res.json();

  return { videos, nextPageToken };
}
