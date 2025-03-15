"use client";

import { formatViewCount } from "@/utils/formatUtils";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelProfile: string;
  publishedAt: string;
  viewCount: string;
}

export default function SearchResult({ videos }: { videos: Video[] }) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      {videos.map((video, index) => (
        <div
          key={video.videoId || `video-${index}`}
          className="flex items-start gap-4 p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition-all"
          onClick={() => router.push(`/watchpage?v=${video.videoId}`)}
        >
          {/* 썸네일 */}
          <Image
            src={video.thumbnail}
            alt={video.title}
            width={360}
            height={202}
            className="w-[360px] h-[202px] object-cover rounded-lg"
            unoptimized={true} // 외부 이미지 최적화 방지
          />

          {/* 영상 정보 */}
          <div className="flex flex-col justify-between">
            <h2 className="text-white font-semibold text-lg line-clamp-2">{video.title}</h2>
            <p className="text-gray-400 text-sm">
              {formatViewCount(video.viewCount)} · {new Date(video.publishedAt).toLocaleDateString()}
            </p>

            {/* 채널 정보 */}
            <div className="flex items-center gap-3 mt-2">
              <Image
                src={video.channelProfile}
                alt={video.channelName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
                unoptimized={true} // 외부 이미지 최적화 방지
              />
              <p className="text-gray-400 text-sm">{video.channelName}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
