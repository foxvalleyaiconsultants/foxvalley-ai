// Storage helpers - placeholder for future S3/file storage integration
// Currently not used by the application

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  throw new Error("Storage not configured. Set up your own S3 or file storage provider.");
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  throw new Error("Storage not configured. Set up your own S3 or file storage provider.");
}
