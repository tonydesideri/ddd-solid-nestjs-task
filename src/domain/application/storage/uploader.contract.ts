export interface UploadParams {
  fileName: string
  body: Buffer
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ path: string }>
}