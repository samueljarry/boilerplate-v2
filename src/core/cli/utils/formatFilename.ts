export const formatFilenameSuffix = (name: string, fileNameSuffix: string) => {
   if (typeof name !== "string" || typeof fileNameSuffix !== "string") return "";

   const clean = (str: string) => str.replace(/[^a-zA-Z0-9]/g, "");

   const words = fileNameSuffix.match(/[A-Z][a-z]*/g) || [];
   const suffixes = [words.join(""), ...words].map((s) => s.toLowerCase());

   const regex = new RegExp(`(${suffixes.join("|")})$`, "i");

   let cleaned = clean(name.replace(regex, ""));

   if (!cleaned) return clean(fileNameSuffix);

   const capitalized = cleaned[0].toUpperCase() + cleaned.slice(1);

   return capitalized + clean(fileNameSuffix);
}
