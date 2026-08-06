export function openWhatsAppShare(message: string) {
  const cleanMessage = message.trim();

  if (!cleanMessage) {
    return;
  }

  const url = `https://wa.me/?text=${encodeURIComponent(cleanMessage)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}