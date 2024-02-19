import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import * as fs from 'fs'
import * as path from 'path'
import { UploadParams, Uploader } from 'src/domain/application/storage/uploader.contract'

@Injectable()
export class FileSystemStorageImpl implements Uploader {
  async upload(params: UploadParams): Promise<{ path: string }> {
    const { fileName, body } = params
    const uploadDir = path.join(__dirname, '../../../uploads') // Directory where uploads will be saved

    // Verifica se o diretório de upload existe, senão, cria um novo
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const uniqueSuffix = randomUUID();
    const fileMineName = fileName.replace(/\s/g, '')
    const uniqueFileName = `${uniqueSuffix}-${fileMineName}`

    const filePath = path.join(uploadDir, uniqueFileName)

    // Escreve o corpo do arquivo no sistema de arquivos
    fs.writeFileSync(filePath, body)


    return { path: uniqueFileName }
  }
}