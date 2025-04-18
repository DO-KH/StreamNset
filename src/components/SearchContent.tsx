"use client"

import { YouTubeVideoResponse } from "@/types/youtube";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchResults from "./searchResult";
import { fetchSearchResults } from "@/libs/fetch-search-result";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [initialResult, setInitialResult] = useState<YouTubeVideoResponse | null>(null);

  useEffect(() => {
    
    if (!query) return;

    setInitialResult(null); // 이전 결과(상태) 초기화

    const fetchData = async () => {
      const result = await fetchSearchResults(query);
      setInitialResult(result);
    };

    fetchData();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-6">
      <h1 className="text-2xl font-bold mb-4">{query} 검색 결과</h1>
          <SearchResults initialResult={initialResult!} query={query} />
    </div>
  )
}