"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchResult from "@/components/searchResult";
import { fetchSearchResults } from "@/libs/fetch-search-result";
import { YouTubeVideoResponse } from "@/types/youtube";

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [initialResult, setInitialResult] = useState<YouTubeVideoResponse | null>(null);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      const result = await fetchSearchResults(query);
      setInitialResult(result);
    };

    fetchData();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-6">
      <h1 className="text-2xl font-bold mb-4">{query} 검색 결과</h1>
      {!initialResult ? (
        <p className="text-center text-gray-400">⏳ 로딩 중...</p>
      ) : (
        <SearchResult initialResult={initialResult} query={query} />
      )}
    </div>
  );
}
