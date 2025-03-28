import { headers } from "next/headers";
import { YouTubeVideoResponse } from "@/types/youtube";

export async function fetchPlaylistVideos(
  playlistId: string,
  pageToken?: string
): Promise<YouTubeVideoResponse> {
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${protocol}://${host}/api/youtube/playlist?playlistId=${playlistId}${
    pageToken ? `&pageToken=${pageToken}` : ""
  }`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      console.error("API 응답 실패:", res.status);
      throw new Error("API 요청 실패");
    }

    const data = await res.json();

    if (!data || !data.videos) {
      console.error("응답에 videos 없음:", data);
      return { videos: [], nextPageToken: null };
    }

    return {
      videos: data.videos,
      nextPageToken: data.nextPageToken ?? null,
    };
  } catch (e) {
    console.error("fetchPlaylistVideos 에러:", e);
    return { videos: [], nextPageToken: null };
  }
}
