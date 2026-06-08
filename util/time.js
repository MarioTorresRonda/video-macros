export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function durationToTime(duration)  {
  const h = Math.floor(duration / 3600);
  const m = Math.floor((duration % 3600) / 60);
  const s = Math.floor(duration % 60);

  return [h, m, s]
    .map(v => String(v).padStart(2, '0'))
    .join(':');
}