import path from 'path';

export const pathFromRoot = (...pathFromRoots: string[]) => {
  return path.resolve(process.cwd(), ...pathFromRoots);
}