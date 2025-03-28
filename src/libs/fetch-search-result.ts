import { YouTubeVideoResponse } from "@/types/youtube";

export async function fetchSearchResults(
  query: string,
  pageToken?: string
): Promise<YouTubeVideoResponse | null> {
  try {
    const url = `/api/youtube/search?query=${encodeURIComponent(query)}${
      pageToken ? `&pageToken=${pageToken}` : ""
    }`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error(res.status);
      return null;
    }

    const data = await res.json();

    if (!data || !data.videos) {
      console.warn("영상 데이터를 찾을 수 없습니다.");
      return null;
    }

    return {
      videos: data.videos,
      nextPageToken: data.nextPageToken ?? null,
    };
  } catch (e) {
    console.error("검색 결과를 불러오는데 실패했습니다.", e);
    return null;
  }
}
