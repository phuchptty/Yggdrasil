import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { KcClientService } from "../../modules/external/kc-client/kc-client.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(@Inject(KcClientService) private readonly kcClient: KcClientService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // @ts-ignore
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.replace("Bearer ", "");

            try {
                // const payload = jwt.verify(token, "your_jwt_secret_key");
                // req["user"] = payload; // Set the payload to the request context

                const introspectToken = await this.kcClient.introspectToken(token);

                if (!introspectToken.active) {
                    next();
                    return;
                }

                req["kcSub"] = introspectToken.sub;
                req["kcRoles"] = this.getAppRoles(introspectToken.realm_access?.roles || []);

                next();
            } catch (error) {
                console.error("error", error);
            }
        }

        next();
    }

    private getAppRoles(roles: string[]): string[] {
        const prefix = "app_";
        return roles.filter((role) => role.startsWith(prefix)).map((role) => role.replace(prefix, "").toUpperCase());
    }
}
