import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchLikedVideos } from "@/libs/fetch-liked-videos";
import MainContents from "@/components/MainContents";

export default async function LikePage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return <div className="text-white">로그인이 필요합니다.</div>;
  }

  const initialvideos = await fetchLikedVideos(session.accessToken);

  return (
    <div>
      <h1 className="text-white text-xl font-bold mb-4">좋아요 한 영상</h1>
      <MainContents initialvideos={initialvideos} />
    </div>
  );
}
