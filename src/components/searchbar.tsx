import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Searchbar() {
  const [query, setQuery] = useState(""); // 🔥 검색어 상태 관리
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return; // 🔥 빈 검색어 방지
    router.push(`/search?q=${encodeURIComponent(query)}`); // 🔥 검색 결과 페이지로 이동
  };
  return (
    <form onSubmit={handleSearch} className="relative flex items-center w-[400px] max-w-[600px] h-10 bg-[#121212] rounded-full shadow-md">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-full px-4 text-white bg-transparent outline-none placeholder-gray-400"
      />
      <button
        type="submit"
        className="absolute right-2 p-2 text-white bg-gray-700 rounded-full hover:bg-gray-600 transition-all">
        <FaSearch size={16} />
      </button>
    </form>
  );
}