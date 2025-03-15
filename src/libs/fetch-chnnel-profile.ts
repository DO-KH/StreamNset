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

  console.log("📌 채널 프로필 응답 데이터:", data);

  // ✅ 채널 ID를 키로, 프로필 URL을 값으로 저장
  const profiles: Record<string, string> = {};
  data.items.forEach((channel: ChannelItem) => {
    profiles[channel.id] = channel.snippet.thumbnails.default?.url || "https://via.placeholder.com/50x50";
  });

  return profiles;
}