import { randomUUID } from 'crypto'
import { UploadParams, Uploader } from 'src/modules/task/domain/application/storage/uploader.contract'

interface Upload {
  fileName: string
  path: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ path: string }> {
    const path = randomUUID()

    this.uploads.push({
      fileName,
      path,
    })

    return { path }
  }
}