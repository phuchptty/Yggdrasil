import { Field, ObjectType } from "@nestjs/graphql";
import { BaseOneAbstractResult } from "../../../commons/dto/base-one.abstract-result";

@ObjectType("Playground_RequestForVmBaseResponse")
export class RequestForVmBaseResponse {
    @Field(() => String)
    workspaceId: string;

    @Field(() => String)
    podName: string;

    @Field(() => String)
    ownerId: string;

    @Field(() => String)
    beaconHost: string;

    @Field(() => String)
    execHost: string;
}

@ObjectType("Playground_RequestForVmResponse")
export class RequestForVmResponse extends BaseOneAbstractResult(RequestForVmBaseResponse) {}
