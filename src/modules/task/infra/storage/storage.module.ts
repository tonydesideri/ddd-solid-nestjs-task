import { Module } from '@nestjs/common';
import { FileSystemStorageImpl } from './file-system-storage.impl';

@Module({
  providers: [FileSystemStorageImpl],
  exports: [FileSystemStorageImpl],
})
export class StorageModule { }