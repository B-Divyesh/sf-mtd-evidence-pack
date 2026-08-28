export const MAX_SOURCE_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_SOURCE_FILE_LABEL = "10 MB";

export function firstOversizedSourceFile(files: File[]): File | undefined {
  return files.find(file => file.size > MAX_SOURCE_FILE_BYTES);
}
