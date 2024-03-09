import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import { randomUUID } from 'node:crypto'
import * as path from 'path'
import { Uploader, UploadParams } from '../../domain/application/storage/uploader.contract'


@Injectable()
export class FileSystemStorageImpl implements Uploader {
  async upload(params: UploadParams): Promise<{ path: string }> {
    const { fileName, body } = params
    // TODO: Receber o caminho como parametro ou colocar como variável
    const uploadDir = path.join(__dirname, '../../../../../uploads') // Directory where uploads will be saved

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