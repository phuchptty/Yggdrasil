import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { RoleEnum } from "@/commons/enums";
import { ROLES_KEY } from "@/decorators/role/role.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredRoles) {
            return true;
        }

        const ctx = GqlExecutionContext.create(context);

        const headers = ctx.getContext().req.headers;

        if (headers["Keycloak-App-Roles"] || headers["keycloak-app-roles"]) {
            const roles = headers["Keycloak-App-Roles"] || headers["keycloak-app-roles"];

            return requiredRoles.some((role) => roles.includes(role));
        }
    }
}
