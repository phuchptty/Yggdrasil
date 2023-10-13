import { Field, InputType } from "@nestjs/graphql";

@InputType("Playground_SaveWorkspaceFileInput")
export class SaveWorkspaceFileInput {
    @Field(() => String, { nullable: false })
    _id: string;

    @Field(() => String, { nullable: false })
    name: string;

    @Field(() => String, { nullable: false })
    path: string;

    @Field(() => String, { nullable: false })
    content: string;
}
