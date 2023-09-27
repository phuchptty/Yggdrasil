import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const headers = ctx.getContext().req.headers;

        console.log("Oh lalala ", headers);

        return !!(headers["Keycloak-App-Roles"] || headers["keycloak-app-roles"] || headers["Keycloak-Sub"] || headers["keycloak-sub"]);
    }
}
