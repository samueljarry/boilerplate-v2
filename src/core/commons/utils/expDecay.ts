export const expDecay = (a: number, b: number, decay: number, dt: number) => {
  return b + (a-b) * Math.exp(-decay*dt);
}