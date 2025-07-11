/**
 * Splits source content into two parts: before and after the body of a specified method.
 */
export const splitByMethodBody = (methodName: string, content: string) => {
  const regex = new RegExp(`${methodName}[\\s\\S]*?{`, "m");
  const match = content.match(regex);

  if (!match?.index) {
    throw new Error(
      `${methodName}() method not found in the content string provided.`
    );
  }

  const startIndex = match.index + match[0].lastIndexOf("{");
  const restOfFile = content.slice(startIndex, content.length);
  const restOfFileChars = restOfFile.split("");

  let braces = 0;
  let endIndex = content.length;
  let i = 0;

  for (const char of restOfFileChars) {
    if (char === "{") braces++;
    if (char === "}") braces--;

    if (braces === 0) {
      endIndex = i;
      break;
    }

    i++;
  }

  const before = content.slice(0, startIndex + endIndex);
  const after = restOfFile.slice(endIndex);

  return [before, after];
};
