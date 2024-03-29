import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const contextObj = ctx.getContext();

        const kcSub = contextObj.kcSub;
        const kcRoles = contextObj.kcRoles;

        return !!(kcSub && kcRoles && kcRoles.length > 0);
    }
}
