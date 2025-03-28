import MainContents from "../components/MainContents";
import { fetchYouTubeVideos } from "../libs/fetch-youtube-videos";

export default async function Home() {
  const initialvideos = await fetchYouTubeVideos();

  return (
    <div>
      <MainContents initialvideos={initialvideos} /> 
    </div>
  );
}
