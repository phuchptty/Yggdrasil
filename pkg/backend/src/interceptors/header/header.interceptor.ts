import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { GqlExecutionContext } from "@nestjs/graphql";
import { KcClientService } from "../../modules/external/kc-client/kc-client.service";

@Injectable()
export class HeaderInterceptor implements NestInterceptor {
    constructor(private readonly kcService: KcClientService) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();
        const token = req.headers.authorization || null;

        if (!token) {
            return next.handle();
        }

        const introspectToken = await this.kcService.introspectToken(token);

        if (!introspectToken) {
            return next.handle();
        }

        ctx.getContext().kcSub = introspectToken.sub;
        ctx.getContext().kcRoles = this.getAppRoles(introspectToken.realm_access?.roles || []);

        return next.handle();
    }

    private getAppRoles(roles: string[]): string[] {
        const prefix = "app_";
        return roles.filter((role) => role.startsWith(prefix)).map((role) => role.replace(prefix, "").toUpperCase());
    }
}
