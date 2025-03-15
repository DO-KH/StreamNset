"use client";

import { useEffect, useState } from "react";
import { fetchSearchResults } from "@/libs/fetch-search-result";

export function useSearchVideos(query: string) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    fetchSearchResults(query)
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ 검색 결과 불러오기 오류:", error);
        setLoading(false);
      });
  }, [query]);

  return { videos, loading };
}