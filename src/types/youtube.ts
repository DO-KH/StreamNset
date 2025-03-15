export interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    channelId: string;
    thumbnails: { 
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
      standard?: { url: string };
      maxres?: { url: string };
    };
  };
  statistics?: { viewCount?: string };
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  channelName: string;
  viewCount: string;
  channelProfile: string;
  publishedAt: string;
}