/**
 * Splits source content into two parts: before and after the body of a specified method.
 */
export const splitByArrayBody = (arrayName: string, content: string) => {
  const regex = new RegExp(`${arrayName}[\\s\\S]*?\\[`, "m");

  const match = content.match(regex);

  if (!match?.index) {
    throw new Error(
      `${arrayName}() method not found in the content string provided.`
    );
  }

  const startIndex = match.index + match[0].lastIndexOf("[");
  const restOfFile = content.slice(startIndex, content.length);
  const restOfFileChars = restOfFile.split("");

  let brackets = 0;
  let endIndex = content.length;
  let i = 0;

  for (const char of restOfFileChars) {
    if (char === "[") brackets++;
    if (char === "]") brackets--;

    if (brackets === 0) {
      endIndex = i;
      break;
    }

    i++;
  }

  const before = content.slice(0, startIndex + endIndex);
  const after = restOfFile.slice(endIndex);

  return [before, after];
};
