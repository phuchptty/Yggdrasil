import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        console.log(request);

        const kcSub = request.kcSub;
        const kcRoles = request.kcRoles;

        return !!(kcSub && kcRoles && kcRoles.length > 0);
    }
}
