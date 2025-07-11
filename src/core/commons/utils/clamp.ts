export const clamp = (x: number, min: number = 0, max: number = 1) => {
  return Math.min(Math.max(x, min), max);
}