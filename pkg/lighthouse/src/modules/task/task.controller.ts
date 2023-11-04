import { Controller, Get } from "@nestjs/common";
import { TaskService } from "./task.service";

@Controller("task")
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Get("get-services")
    public async getServices() {
        return {
            data: await this.taskService.getServices(),
        };
    }

    @Get("triggerPendingDelete")
    public async triggerPendingDelete() {
        await this.taskService.handlePendingDeletePod();
        return "OK";
    }

    @Get("triggerExpiredWorkspace")
    public async triggerExpiredWorkspace() {
        await this.taskService.handleExpiredWorkspace();
        return "OK";
    }
}
