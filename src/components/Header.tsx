"use client"

import { useRouter } from "next/navigation";
import Searchbar from "./searchbar";
import { FaPlayCircle } from "react-icons/fa"; // 원하는 아이콘 선택
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  return (
    <header className="fixed top-0 w-full h-14 bg-[#0F0F0F] shadow-md z-10">
      <HeaderContent />
    </header>
  );
}

function HeaderContent() {
  const router = useRouter();
  const {data: session } = useSession();
  return (
    <div className="relative flex items-center w-full h-full px-6 text-white">
      {/* 타이틀 (왼쪽) */}
      <h1
        onClick={()=>router.push('/')}
        className="text-lg font-bold cursor-pointer flex items-center gap-2">
        <FaPlayCircle className="text-red-500 text-2xl" /> {/* 아이콘 적용 */}
        StreamNest
      </h1>

      {/* 검색바 (가운데 정렬) */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Searchbar />
      </div>

      {/* 로그인 버튼 (오른쪽) */}
      {session ? (
          <button
            onClick={() => signOut()}
            className="ml-auto px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md shadow hover:bg-gray-700 transition-all"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="ml-auto px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow hover:bg-red-700 transition-all"
          >
            Sign In
          </button>
        )}
    </div>
  );
}
