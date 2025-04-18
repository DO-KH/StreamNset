import { fetchWatchVideo } from "@/libs/fetch-watch-video";
import { Metadata } from "next";
import { notFound } from "next/navigation";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ videoId: string }>;
}): Promise<Metadata> {
  const { videoId } = await params;
  const video = await fetchWatchVideo(videoId);

  if (!video) {
    return {
      title: "영상을 찾을 수 없습니다",
    };
  }

  return {
    title: `${video.title} - StreamNest`,
    description: `${video.channelName}의 영상입니다. 조회수 ${video.viewCount}회`,
    openGraph: {
      title: video.title,
      description: `${video.channelName}의 인기 영상`,
      images: [video.thumbnail],
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: `${video.channelName}의 인기 영상`,
      images: [video.thumbnail],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  const video: YouTubeVideo = await fetchWatchVideo(videoId);

  if (!video) return notFound();

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
        <h1 className="text-xl font-bold">{video.title}</h1>

        {/* 📌 채널 정보 */}
        <div className="flex items-center mt-6 border-b border-gray-700 pb-4">
          <img
            src={video.channelProfile}
            alt={video.channelName}
            className="w-10 h-10 rounded-full mr-4"
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
