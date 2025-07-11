import fs from 'fs';

export const writeIdToStringEnum = (enumPath: string, id: string) => {
  let fileContent = fs.readFileSync(enumPath, "utf-8");

  const idExists = new RegExp(`\\b${id}\\b`).test(fileContent);

  if (!idExists) {
    const enumEndIndex = fileContent.lastIndexOf("}");
    if (enumEndIndex === -1) {
      throw new Error("Could not find closing bracket for given enum.");
    }

    const newLine = `  ${id} = '${id}',\n`;

    fileContent =
      fileContent.slice(0, enumEndIndex) +
      newLine +
      fileContent.slice(enumEndIndex);

    fs.writeFileSync(enumPath, fileContent, "utf-8");
  }
}