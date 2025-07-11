import fs from 'fs';
import path from 'path';

export const readFilesInFolder = (dir: string, recursively = false) => {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      if (recursively) {
        results = results.concat(readFilesInFolder(filePath, true));
      }
    } else {
      results.push(filePath);
    }
  }

  return results;
}