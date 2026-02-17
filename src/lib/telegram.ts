export function createTelegramLink(
  data: Record<string, string | number | undefined>,
): string {
  const lines = Object.entries(data)
    .filter(([_, value]) => value !== undefined && value !== "")
    .map(([key, value]) => {
      const cleanValue = String(value).trim().replace(/[<>]/g, "");
      return key ? `${key}: ${cleanValue}` : cleanValue;
    });

  const text = lines.join("\n");
  const encodedText = encodeURIComponent(text);
  return `https://t.me/shitsu_zakaz?text=${encodedText}`;
}
