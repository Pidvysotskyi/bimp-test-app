export const sanitizeFileName = (fileName: string): string => {
  const normalized = fileName.normalize("NFD");

  const asciiFilename = normalized
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_.-]/g, "_")
    .toLowerCase();

  return asciiFilename;
};
