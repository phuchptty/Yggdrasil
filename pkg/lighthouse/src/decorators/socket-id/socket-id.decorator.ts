import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const SocketId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const gqlExecutionContext = GqlExecutionContext.create(ctx);
    const contextObj = gqlExecutionContext.getContext();

    return contextObj.socketId || null;
});
