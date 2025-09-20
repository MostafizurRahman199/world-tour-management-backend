// src/utils/fileTypes.ts

// Category wise MIME types
export const fileCategories = {
  image: [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ],
  video: [
    "video/mp4",
    "video/mpeg",
    "video/webm",
    "video/ogg",
  ],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
  ],
  archive: [
    "application/zip",
    "application/x-zip-compressed",
  ],
};

// Function: get allowed types based on category
export function getAllowedTypes(category: string): string[] {
  switch (category) {
    case "image":
      return fileCategories.image;
    case "video":
      return fileCategories.video;
    case "document":
      return fileCategories.document;
    case "all":
      return [
        ...fileCategories.image,
        ...fileCategories.video,
        ...fileCategories.document,
        ...fileCategories.archive,
      ];
    default:
      return fileCategories.image; // default fallback
  }
}
