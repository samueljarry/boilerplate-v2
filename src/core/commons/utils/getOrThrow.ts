export const getOrThrowError = <K, V>(map: Map<K, V>, key: K, errorMessage = ""): V => {
  const value = map.get(key);

  if (!value) {
    throw new Error(errorMessage);
  }

  return value;
};