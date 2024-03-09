import { Module } from "@nestjs/common";
import { HttpModule } from "./infra/http/http.module";
import { PersistenceModule } from "./infra/persistence/persistence.module";
import { StorageModule } from "./infra/storage/storage.module";

@Module({
  imports: [PersistenceModule, StorageModule, HttpModule],
})
export class TaskModule { }
