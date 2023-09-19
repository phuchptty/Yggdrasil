import { Module } from '@nestjs/common';
import { ContainerResourceService } from './container-resource.service';
import { ContainerResourceGateway } from './container-resource.gateway';

@Module({
  providers: [ContainerResourceService, ContainerResourceGateway]
})
export class ContainerResourceModule {}
