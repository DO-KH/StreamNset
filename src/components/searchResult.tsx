"use client";

import { formatViewCount } from "@/utils/formatUtils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { YouTubeVideo, YouTubeVideoResponse } from "@/types/youtube";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchSearchResults } from "@/libs/fetch-search-result";

export default function SearchResults({
  initialResult,
  query,
  filter,
}: {
  initialResult: YouTubeVideoResponse;
  query: string;
  filter: "relevance" | "viewCount" | "date"
}) {
  const [videos, setVideos] = useState<YouTubeVideo[]>(initialResult.videos);
  const [nextPageToken, setNextPageToken] = useState<string | null>(
    initialResult.nextPageToken
  );
  const loaderRef = useRef(null);
  const router = useRouter();

  const loadMore = useCallback(async () => {
    if (!nextPageToken) return;

    const res = await fetchSearchResults(query, nextPageToken, filter);
    if (!res) return;

    const newVideos = res.videos.filter(
      (newVid) => !videos.some((v) => v.videoId === newVid.videoId)
    );

    setVideos((prev) => [...prev, ...newVideos]);
    setNextPageToken(res.nextPageToken);
  }, [query, nextPageToken, videos, filter]); // 의존성 정확히 설정

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore]); // ✅ 이제 loadMore만 의존성으로 OK

  

  return (
    <div className="flex flex-col gap-6">
      {videos.map((video, index) => (
        <div
          key={video.videoId || `video-${index}`}
          className="flex items-start gap-4 p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition-all"
          onClick={() => router.push(`/watch/${video.videoId}`)}
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
            <h2 className="text-white font-semibold text-lg line-clamp-2">
              {video.title}
            </h2>
            <p className="text-gray-400 text-sm">
              {formatViewCount(video.viewCount)} ·{" "}
              {new Date(video.publishedAt).toLocaleDateString()}
            </p>

            {/* 채널 정보 */}
            <div className="flex items-center gap-3 mt-2">
              <Image
                src={video.channelProfile}
                alt={video.channelName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
                unoptimized={true}
              />
              <p className="text-gray-400 text-sm">{video.channelName}</p>
            </div>
          </div>
        </div>
      ))}
      <div
        ref={loaderRef}
        className="h-40 mt-10 flex justify-center items-center"
      >
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    </div>
  );
}
