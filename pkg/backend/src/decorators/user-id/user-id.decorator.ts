import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const gqlExecutionContext = GqlExecutionContext.create(ctx);
    const request: Request = gqlExecutionContext.getContext().req;
    const headers = request.headers;

    let userId = null;

    if (headers["Keycloak-Sub"] || headers["keycloak-sub"]) {
        userId = headers["Keycloak-Sub"] || headers["keycloak-sub"];
    }

    return userId;
});
