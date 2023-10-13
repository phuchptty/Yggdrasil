import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const gqlExecutionContext = GqlExecutionContext.create(ctx);
    const contextObj = gqlExecutionContext.getContext();

    return contextObj.kcSub || null;
});
