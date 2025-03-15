"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchYouTubeVideoById } from "../../libs/fetch-watch-video";
import { FaThumbsUp, FaEye } from "react-icons/fa"; // ✅ 아이콘 추가
import { FaClock } from "react-icons/fa6";

interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  channelName: string;
  viewCount: string;
  likeCount: string;
  channelProfile: string;
  publishedAt: string;
}

export default function WatchPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v");

  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoId) return;

    setLoading(true);
    fetchYouTubeVideoById(videoId)
      .then((data) => {
        setVideo(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ 영상 데이터를 불러오는 중 오류 발생:", error);
        setLoading(false);
      });
  }, [videoId]);

  if (!videoId) return <div className="text-white text-center mt-10">📌 영상이 없습니다.</div>;
  if (loading) return <div className="text-white text-center mt-10">⏳ 로딩 중...</div>;
  if (!video) return <div className="text-white text-center mt-10">❌ 영상을 찾을 수 없습니다.</div>;

  return (
    <div className="flex flex-col items-center bg-[#0F0F0F] min-h-screen p-8 text-white">
      {/* 🎥 유튜브 영상 (크기 조정) */}
      <iframe
        className="w-full max-w-4xl h-[550px] sm:h-[450px] md:h-[550px] rounded-lg shadow-lg"
        src={`https://www.youtube.com/embed/${video.videoId}`}
        title={video.title}
        allowFullScreen
      />

      {/* ℹ️ 영상 정보 섹션 */}
      <div className="w-full max-w-4xl mt-8 px-6">
        {/* 🎬 영상 제목 */}
        <h1 className="text-3xl font-bold">{video.title}</h1>

        {/* 📌 채널 정보 */}
        <div className="flex items-center mt-6 border-b border-gray-700 pb-4">
          <img
            src={video.channelProfile}
            alt={video.channelName}
            className="w-14 h-14 rounded-full mr-4"
          />
          <div>
            <p className="text-xl font-semibold">{video.channelName}</p>
          </div>
        </div>

        {/* 👀 조회수 & 👍 좋아요 */}
        <div className="flex justify-start gap-6 mt-5 text-gray-400">
          <p className="flex items-center gap-2 text-lg">
            <FaEye className="text-2xl text-gray-300" />
            {video.viewCount}회 조회
          </p>
          <p className="flex items-center gap-2 text-lg">
            <FaThumbsUp className="text-2xl text-gray-300" />
            {video.likeCount}회 좋아요
          </p>

          <p className="flex items-center gap-2 text-lg">
            <FaClock className="text-2xl text-gray-300" />
            {formatUploadDate(video.publishedAt)} 업로드
          </p>
        </div>
      </div>
    </div>
  );
}

function formatUploadDate(publishedAt: string): string {
  const date = new Date(publishedAt);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}