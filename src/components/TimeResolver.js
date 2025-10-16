export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds}s `;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m `;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h `;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d `;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo `;
  const years = Math.floor(months / 12);
  return `${years}y `;
}


export function formatVideoDuration(seconds) {
  if (seconds == null || isNaN(seconds)) return '0:00';

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const paddedMins = hrs > 0 ? String(mins).padStart(2, '0') : String(mins);
  const paddedSecs = String(secs).padStart(2, '0');

  return hrs > 0 ? `${hrs}:${paddedMins}:${paddedSecs}` : `${paddedMins}:${paddedSecs}`;
}

