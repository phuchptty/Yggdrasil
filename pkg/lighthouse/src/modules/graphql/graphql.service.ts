import { Injectable, Logger } from "@nestjs/common";
import { KcClientService } from "../external/kc-client/kc-client.service";
import { Request } from "express";

@Injectable()
export class GraphqlService {
    constructor(private readonly kcService: KcClientService) {}

    private logger = new Logger(GraphqlService.name);

    private async introspectToken(token: string) {
        const strippedToken = token.replace("Bearer ", "");
        return this.kcService.introspectToken(strippedToken);
    }

    async handleContext(req: Request) {
        const token = req.headers.authorization || null;

        if (!token) {
            return { ...req };
        }

        try {
            const introspectToken = await this.introspectToken(token);

            if (!introspectToken) {
                return { ...req };
            }

            return {
                ...req,
                kcSub: introspectToken.sub,
                kcRoles: this.getAppRoles(introspectToken.realm_access?.roles || []),
            };
        } catch (e) {
            this.logger.error(e);

            return { ...req };
        }
    }

    private getAppRoles(roles: string[]): string[] {
        const prefix = "app_";
        return roles.filter((role) => role.startsWith(prefix)).map((role) => role.replace(prefix, "").toUpperCase());
    }
}
