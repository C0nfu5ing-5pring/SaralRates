export const bookmarkSound =
  typeof Audio != "undefined" ? new Audio("/audio/added.mp3") : null;
export const compareSound =
  typeof Audio != "undefined" ? new Audio("/audio/notification.mp3") : null;
export const unBookmarkSound =
  typeof Audio != "undefined" ? new Audio("/audio/notification.mp3") : null;
