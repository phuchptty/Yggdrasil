import { Injectable } from "@nestjs/common";
import { KcClientService } from "../external/kc-client/kc-client.service";
import { Request } from "express";

@Injectable()
export class GraphqlService {
    constructor(private readonly kcService: KcClientService) {}

    async handleContext(req: Request) {
        const token = req.headers.authorization || null;

        if (!token) {
            return { ...req };
        }

        const strippedToken = token.replace("Bearer ", "");
        const introspectToken = await this.kcService.introspectToken(strippedToken);

        if (!introspectToken) {
            return { ...req };
        }

        return {
            ...req,
            kcSub: introspectToken.sub,
            kcRoles: this.getAppRoles(introspectToken.realm_access?.roles || []),
        };
    }

    private getAppRoles(roles: string[]): string[] {
        const prefix = "app_";
        return roles.filter((role) => role.startsWith(prefix)).map((role) => role.replace(prefix, "").toUpperCase());
    }
}
