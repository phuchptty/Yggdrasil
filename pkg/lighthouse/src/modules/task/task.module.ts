import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { ScheduleModule } from "@nestjs/schedule";
import { KubeApiModule } from "../external/kube-api/kube-api.module";
import { TaskController } from './task.controller';

@Module({
    providers: [TaskService],
    imports: [ScheduleModule.forRoot(), KubeApiModule],
    controllers: [TaskController],
})
export class TaskModule {}
