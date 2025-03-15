"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import MainContents from "@/components/MainContents";
import { fetchLikedVideos } from "@/libs/fetch-liked-videos";

export default function LikeVideos() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!session) return; // ✅ session이 없으면 실행하지 않음

    const accessToken = session.accessToken; // ✅ 타입 단언을 사용해 accessToken을 가져옴
    if (!accessToken) return;

    async function loadLikedVideos() {
      try {
        const likedVideos = await fetchLikedVideos(accessToken);
        setVideos(likedVideos);
      } catch (error) {
        console.error("Error fetching liked videos:", error);
      }
    }

    loadLikedVideos();
  }, [session]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-4">좋아요 한 영상</h1>
      <MainContents videos={videos} />
    </div>
  );
}