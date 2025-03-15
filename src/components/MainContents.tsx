"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { YouTubeVideo } from "@/types/youtube";
import { formatRelativeTime } from "@/utils/dateUtils";
import { formatViewCount } from "@/utils/formatUtils";

export default function MainContents({ videos }: { videos: YouTubeVideo[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#0f0f0f] text-white p-6">
      {videos.map((video) => (
        <Content key={video.videoId} video={video} />
      ))}
    </div>
  );
}

function Content({ video }: { video: YouTubeVideo }) {
  const router = useRouter();

  return (
    <div
      className="bg-[#202020] p-3 rounded-lg shadow-lg cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
      onClick={() => router.push(`/watchpage?v=${video.videoId}`)}
    >
      {/* 동영상 썸네일 */}
      <Image
        src={video.thumbnail}
        alt={video.title}
        width={480} // 적절한 값 설정 (YouTube 기본 썸네일 크기)
        height={270}
        className="w-full h-48 object-cover rounded-lg"
        unoptimized={true} // 외부 이미지 최적화 방지 (YouTube 이미지 URL)
      />

      {/* 프로필 + 제목 + 채널명 */}
      <div className="flex mt-3 gap-3 items-start">
        {/* 채널 프로필 이미지 */}
        <Image
          src={video.channelProfile || "https://via.placeholder.com/50x50"} // 기본 이미지 설정
          alt={video.channelName}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
          unoptimized={true} // 외부 이미지 최적화 방지
        />

        {/* 영상 제목 & 채널 정보 */}
        <div className="flex flex-col">
          <h2 className="text-white font-semibold text-lg line-clamp-2">
            {video.title}
          </h2>
          <p className="text-gray-400 text-sm">{video.channelName}</p>
          <p className="text-gray-500 text-sm">
            조회수 {formatViewCount(video.viewCount)} · {formatRelativeTime(video.publishedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
