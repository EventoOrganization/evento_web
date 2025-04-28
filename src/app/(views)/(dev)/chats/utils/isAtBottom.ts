export function isAtBottom(scrollEl: HTMLDivElement): boolean {
  const threshold = 100; // px, tu peux ajuster
  const position = scrollEl.scrollTop + scrollEl.clientHeight;
  const height = scrollEl.scrollHeight;
  return height - position < threshold;
}
