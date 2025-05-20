"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchResults from "./searchResult";
import { fetchSearchResults } from "@/libs/fetch-search-result";
import { YouTubeVideoResponse } from "@/types/youtube";

export default function SearchContent() {
  const searchParams = useSearchParams(); // 형재 URL의 쿼리스프링 파라미터 읽기
  const router = useRouter(); // 라우팅 제어

  const query = searchParams.get("q") || "";
  const orderFromUrl = searchParams.get("order") as "relevance" | "viewCount" | "date" | null;
  const [filter, setFilter] = useState<"relevance" | "viewCount" | "date">("relevance");
  const [initialResult, setInitialResult] = useState<YouTubeVideoResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // 최초 진입 및 URL 변경 대응
  useEffect(() => {
    if (!query) return;

    const order = orderFromUrl ?? "relevance";
    setFilter(order);
    setLoading(true);
    fetchSearchResults(query, undefined, order).then((result) => {
      setInitialResult(result);
      setLoading(false);
    });
  }, [query, orderFromUrl]);

  // 버튼 클릭 시
  const handleFilterClick = async (order: typeof filter) => {
    if (order === filter) return; // 중복 클릭 방지
    setFilter(order);
    setInitialResult(null);
    setLoading(true);

    const newParams = new URLSearchParams(searchParams); // 편집 가능한 형태로 복사
    newParams.set("order", order);  // 새로운 필드로 덮어쓰기
    router.push(`/search?${newParams.toString()}`);  // 해당 URL로 이동

    const result = await fetchSearchResults(query, undefined, order);
    setInitialResult(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-6">
      <h1 className="text-2xl font-bold mb-4">{query} 검색 결과</h1>

      {/* 필터 버튼 */}
      <div className="mb-6 flex gap-3">
        {["relevance", "viewCount", "date"].map((type) => (
          <button
            key={type}
            onClick={() => handleFilterClick(type as typeof filter)}
            className={`px-4 py-2 rounded ${
              filter === type
                ? "bg-teal-500 text-white"
                : "bg-[#1f1f1f] text-gray-300"
            }`}
          >
            {type === "relevance" ? "관련도순" : type === "viewCount" ? "조회수순" : "최신순"}
          </button>
        ))}
      </div>

      {/* 로딩 중 표시 */}
      {loading && <p className="text-gray-400 animate-pulse">불러오는 중...</p>}

      {/* 결과 */}
      {initialResult && (
        <SearchResults initialResult={initialResult} query={query} filter={filter} />
      )}
    </div>
  );
}
