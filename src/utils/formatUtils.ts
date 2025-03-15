export function formatViewCount(viewCount: string | number): string {
  const count = typeof viewCount === "string" ? parseInt(viewCount, 10) : viewCount;

  if (isNaN(count)) return "조회수 없음"; // 잘못된 데이터 방지

  if (count >= 100000000) {
    return `${(count / 100000000).toFixed(1)}억회`; // 1억 이상 → 'x.x억회'
  } else if (count >= 10000000) {
    return `${Math.floor(count / 10000000)}천만회`; // 1천만 이상 → 'x천만회'
  } else if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}만회`; // 100만 이상 → 'x.x만회'
  } else if (count >= 10000) {
    return `${Math.floor(count / 10000)}만회`; // 1만 이상 → 'x만회'
  } else {
    return `${count.toLocaleString()}회`; // 1만 미만 → 원래 숫자 그대로
  }
}
