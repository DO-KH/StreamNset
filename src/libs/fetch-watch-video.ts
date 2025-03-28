import { headers } from "next/headers";

export async function fetchWatchVideo(videoId: string) {
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = (await headers()).get("host"); // ✅ 서버에서 헤더 통해 호스트 추출

  try {
    const res = await fetch(
      `${protocol}://${host}/api/youtube/watch?videoId=${videoId}`
    );

    if (!res.ok) {
      console.error("API 응답 실패:", res.status);
      return null;
    }

    const data = await res.json();

    // 응답이 null인 경우 처리
    if (data === null) {
      console.warn("영상 데이터를 찾을 수 없습니다.");
      return null;
    }

    return data;
  } catch (error) {
    console.error("fetchWatchVideo 오류:", error);
    return null;
  }
}
