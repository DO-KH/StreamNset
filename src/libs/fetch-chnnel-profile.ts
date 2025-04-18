interface ChannelItem {
  id: string;
  snippet: {
    thumbnails: { 
      default?: { url: string }
      medium?: { url: string };
      high?: { url: string }; 
    };
  };
}

export async function fetchChannelProfiles(channelIds: string[], apiKey: string): Promise<Record<string, string>> {
  if (channelIds.length === 0) return {};

  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds.join(
    ","
  )}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.items) return {};


  // 채널 ID를 키로, 프로필 URL을 값으로 저장
  return data.items.reduce((acc: Record<string, string>, channel: ChannelItem) => {
    acc[channel.id] = channel.snippet.thumbnails.default?.url || "https://via.placeholder.com/50x50";
    return acc;
  }, {});
}