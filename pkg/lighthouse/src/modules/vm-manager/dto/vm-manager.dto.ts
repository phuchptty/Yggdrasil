import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("Playground_VmManagerBaseResponse")
export class VmManagerBaseResponse {
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
