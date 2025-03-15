import MainContents from "../components/MainContents";
import { fetchYouTubeVideos } from "../libs/fetch-youtube-videos";

export default async function Home() {
  const videos = await fetchYouTubeVideos();

  return (
    <div>
      <MainContents videos={videos} /> 
    </div>
  );
}
