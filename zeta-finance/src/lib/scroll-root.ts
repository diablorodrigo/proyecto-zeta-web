export const SCROLL_ROOT_ID = "scroll-root";

/** En mobile el documento scrollea dentro de #scroll-root. En sm+ es la ventana. */
export function getScrollRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const el = document.getElementById(SCROLL_ROOT_ID);
  if (!el) return null;
  const overflowY = getComputedStyle(el).overflowY;
  if (overflowY !== "auto" && overflowY !== "scroll") return null;
  return el;
}
