"use client"

import SearchResult from "@/components/searchResult";
import { useSearchParams } from "next/navigation";
import { useSearchVideos } from "@/hooks/useSearchVideos";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || ""; // 🔥 URL에서 검색어 가져오기
  const { videos, loading } = useSearchVideos(query);

  console.log(videos)

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-6">
      <h1 className="text-2xl font-bold mb-4"> {query} 검색 결과</h1>

      {loading ? (
        <p className="text-center">⏳ 로딩 중...</p>
      ) : (
        <SearchResult videos={videos} />
      )}
    </div>
  );
}