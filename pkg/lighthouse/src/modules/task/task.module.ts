import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { ScheduleModule } from "@nestjs/schedule";
import { KubeApiModule } from "../external/kube-api/kube-api.module";

@Module({
    providers: [TaskService],
    imports: [ScheduleModule.forRoot(), KubeApiModule],
})
export class TaskModule {}
