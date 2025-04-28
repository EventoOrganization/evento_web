export function isAtBottom(element: HTMLElement, tolerance = 30) {
  const distanceFromBottom =
    element.scrollHeight - element.scrollTop - element.clientHeight;

  console.log("[isAtBottom] Distance from bottom:", distanceFromBottom);

  return distanceFromBottom <= tolerance;
}
