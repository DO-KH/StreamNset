"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { YouTubeVideo, YouTubeVideoResponse } from "@/types/youtube";
import { formatRelativeTime } from "@/utils/dateUtils";
import { formatViewCount } from "@/utils/formatUtils";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchYouTubeVideos } from "@/libs/fetch-youtube-videos";

export default function MainContents({
  initialvideos,
}: {
  initialvideos: YouTubeVideoResponse;
}) {
  const [videos, setVideos] = useState(initialvideos.videos);
  const [nextPageToken, setNextPageToken] = useState<string | null>(
    initialvideos.nextPageToken
  );
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchYouTubeVideos(nextPageToken!);

      // 중복 요청 방지
      setVideos((prev) => {
        const existingIds = new Set(prev.map((v) => v.videoId));
        const uniqueNewVideos = res.videos.filter(
          (v) => !existingIds.has(v.videoId)
        );
        return [...prev, ...uniqueNewVideos];
      });

      setNextPageToken(res.nextPageToken);
    } catch (err) {
      console.error("더보기 실패", err);
    } finally {
      setLoading(false);
    }
  }, [nextPageToken]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && nextPageToken && !loading) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore, loading, nextPageToken]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#0f0f0f] text-white p-6">
      {videos?.map((video) => (
        <Content key={video.videoId} video={video} />
      ))}
      <div ref={loaderRef} className="h-40 mt-10">
        {loading && <p className="text-center text-gray-400">불러오는 중...</p>}
      </div>
    </div>
  );
}

function Content({ video }: { video: YouTubeVideo }) {
  const router = useRouter();

  return (
    <div
      className="bg-[#202020] p-3 rounded-lg shadow-lg cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
      onClick={() => {
        router.push(`/watch/${video.videoId}`);
      }}
    >
      {/* 동영상 썸네일 */}
      <Image
        src={video.thumbnail}
        alt={video.title}
        width={480} // YouTube 기본
        height={270}
        className="w-full h-48 object-cover rounded-lg"
        unoptimized={true}
      />

      {/* 프로필 + 제목 + 채널명 */}
      <div className="flex mt-3 gap-3 items-start">
        <Image
          src={video.channelProfile || "https://via.placeholder.com/50x50"}
          alt={video.channelName}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
          unoptimized={true}
        />

        <div className="flex flex-col">
          <h2 className="text-white font-semibold text-lg line-clamp-2">
            {video.title}
          </h2>
          <p className="text-gray-400 text-sm">{video.channelName}</p>
          <p className="text-gray-500 text-sm">
            조회수 {formatViewCount(video.viewCount)} ·{" "}
            {formatRelativeTime(video.publishedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
