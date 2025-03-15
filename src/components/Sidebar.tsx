"use client";

import { useRouter } from "next/navigation";
import { playlists } from "../libs/playlists";
import { BiCategory } from "react-icons/bi"; // 카테고리 아이콘 추가
import { FaPlayCircle } from "react-icons/fa"; // 플레이리스트 기본 아이콘
import { FaHeart } from "react-icons/fa6";

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-60 h-screen bg-[#0F0F0F] p-6 hidden md:flex flex-col items-center text-white">
      <nav className="w-full space-y-2">
        {/* ✅ 중앙 정렬된 카테고리 타이틀 */}
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-300">
          <BiCategory className="text-xl" />
          카테고리
        </div>
        
        {/* ✅ '좋아요 한 영상' 추가 */}
        <div
          className="flex items-center gap-3 w-full px-4 pt-2 mt-4 rounded-lg cursor-pointer text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          onClick={() => router.push("/likedvideos")}
        >
          <FaHeart className="text-red-500 text-md" /> {/* 하트 아이콘 */}
          <span className="text-sm">좋아요 한 영상</span>
        </div>

        {/* ✅ 중앙 정렬된 플레이리스트 항목 */}
        <div className="flex flex-col w-full mt-4 space-y-2">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-lg cursor-pointer text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
              onClick={() => router.push(`/playlist/${playlist.id}`)}
            >
              <FaPlayCircle className="text-md" /> {/* 아이콘 추가 */}
                <span className="text-sm">{playlist.name}</span>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}