/** Parse private supergroup links: https://t.me/c/2855840897/11 */
export function parseTelegramMessageLink(input: string): {
  chatId: string;
  messageId: number;
} | null {
  const trimmed = input.trim();
  const patterns = [
    /t\.me\/c\/(\d+)\/(\d+)/i,
    /telegram\.me\/c\/(\d+)\/(\d+)/i,
    /^c\/(\d+)\/(\d+)$/i,
    /^(-100\d+):(\d+)$/,
  ];

  for (const re of patterns) {
    const m = trimmed.match(re);
    if (!m) continue;
    const rawId = m[1];
    const chatId = rawId.startsWith("-100") ? rawId : `-100${rawId}`;
    return { chatId, messageId: parseInt(m[2], 10) };
  }

  return null;
}

export function parseTelegramChatLink(input: string): { chatId: string } | null {
  const msg = parseTelegramMessageLink(input);
  if (msg) return { chatId: msg.chatId };

  const m = input.trim().match(/t\.me\/c\/(\d+)/i);
  if (!m) return null;
  const rawId = m[1];
  return { chatId: rawId.startsWith("-100") ? rawId : `-100${rawId}` };
}
