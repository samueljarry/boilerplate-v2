import fs from 'fs';
import { pathFromRoot } from './getPathFromRoot';

export const getInitCommandList = () => {
  const dir = pathFromRoot("src/commands/inits");
  return fs.readdirSync(dir);
}