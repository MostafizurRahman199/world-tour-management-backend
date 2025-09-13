// Simple slugify helper (no external package)


export const makeSlug = (text: string): string => {
  return text
    .toLowerCase() // convert to lowercase
    .trim() // remove leading/trailing spaces
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/-+/g, "-"); // collapse multiple dashes
};