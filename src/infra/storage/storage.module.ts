import { Module } from '@nestjs/common';
import { FileSystemStorageImpl } from './local-storage.impl';

@Module({
  providers: [FileSystemStorageImpl],
  exports: [FileSystemStorageImpl],
})
export class StorageModule { }