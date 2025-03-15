import MainContents from "@/components/MainContents";
import { fetchPlaylistVideos } from "@/libs/fetch-playlist-videos";
import { playlists } from "@/libs/playlists";

export default async function Page({ params }: { params: { id: string } }) {
  const playlistId = Array.isArray(params.id) ? params.id[0] : params.id;
  const videos = await fetchPlaylistVideos(playlistId);
  const playlist = playlists.find((p) => p.id === playlistId);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      {/* ✅ 플레이리스트 제목 영역 */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <h1 className="text-2xl font-bold border-b border-gray-700 pb-3">
          {playlist ? playlist.name : ""}
        </h1>
      </div>

      {/* ✅ 메인 컨텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-6">
        <MainContents videos={videos} />
      </div>
    </div>
  );
}
