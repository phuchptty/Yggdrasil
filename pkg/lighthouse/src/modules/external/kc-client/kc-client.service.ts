import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import qs from "querystring";
import { lastValueFrom } from "rxjs";
import dayjs from "dayjs";
import { KC_ACCESS_TOKEN, KC_EXPIRES_TS } from "./kc-client.const";
import { KeyCloakGroup, KeyCloakTokenIntrospectRsp, KeyCloakUser } from "../../../types/keycloak";
import { RedisService } from "../../redis/redis.service";

@Injectable()
export class KcClientService implements OnModuleInit {
    private readonly kcClientTokenApiUrl: string;
    private readonly kcClientAdminRestApiUrl: string;
    private logger = new Logger(KcClientService.name);

    constructor(private readonly httpService: HttpService, private configService: ConfigService, private readonly redisService: RedisService) {
        this.kcClientTokenApiUrl = `${this.configService.get("keycloak.baseUrl")}/realms/master/protocol/openid-connect/token`;
        this.kcClientAdminRestApiUrl = `${this.configService.get("keycloak.baseUrl")}/admin/realms/${this.configService.get("keycloak.realm")}`;
    }

    onModuleInit(): void {
        this.getKcToken()
            .then(() => {
                this.logger.log("Keycloak token refreshed");
            })
            .catch((e) => {
                this.logger.error("Keycloak token refresh failed");
                throw e;
            });
    }

    private async getKcToken() {
        try {
            const params = qs.stringify({
                client_id: this.configService.get("keycloak.clientId"),
                grant_type: "client_credentials",
                client_secret: this.configService.get("keycloak.clientSecret"),
            });

            const headers = { headers: { "content-type": "application/x-www-form-urlencoded" } };

            const { data } = await lastValueFrom(this.httpService.post(this.kcClientTokenApiUrl, params, headers));

            if (!data) {
                return new Error("Cannot get access token from Keycloak");
            }

            const expTimestamp = dayjs()
                .add(data.expires_in ?? 0, "second")
                .unix();

            await this.redisService.redisClient.set(KC_ACCESS_TOKEN, data.access_token, {
                EX: data.expires_in ?? 0,
            });
            await this.redisService.redisClient.set(KC_EXPIRES_TS, expTimestamp);
        } catch (e) {
            throw new Error(e);
        }
    }

    private async getAccessToken() {
        try {
            const exp = await this.redisService.redisClient.get(KC_EXPIRES_TS);
            const currentTime = dayjs().unix();
            const currentToken = await this.redisService.redisClient.get(KC_ACCESS_TOKEN);

            if (!currentToken) {
                await this.getKcToken();
            }

            if (Number(exp) <= currentTime) {
                await this.getKcToken();
            }

            return this.redisService.redisClient.get(KC_ACCESS_TOKEN);
        } catch (e) {
            throw e;
        }
    }

    public async getUser(userId: string): Promise<KeyCloakUser | undefined> {
        try {
            const serverToken = await this.getAccessToken();

            const { data } = await lastValueFrom(
                this.httpService.get(`${this.kcClientAdminRestApiUrl}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${serverToken}`,
                    },
                }),
            );

            return data;
        } catch (e) {
            this.logger.error(`User Id ${userId} - ${e.message}`);
            return undefined;
        }
    }

    public async getUserGroups(userId: string): Promise<KeyCloakGroup[] | undefined> {
        try {
            const serverToken = await this.getAccessToken();

            const { data } = await lastValueFrom(
                this.httpService.get(`${this.kcClientAdminRestApiUrl}/users/${userId}/groups`, {
                    headers: {
                        Authorization: `Bearer ${serverToken}`,
                    },
                }),
            );

            return data;
        } catch (e) {
            this.logger.error(`User Id ${userId} - ${e.message}`);
            return undefined;
        }
    }

    public async introspectToken(token: string): Promise<undefined | KeyCloakTokenIntrospectRsp> {
        // If not call keycloak api
        const params = qs.stringify({
            token,
            client_id: this.configService.get<string>("keycloak.auth.clientId"),
            client_secret: this.configService.get<string>("keycloak.auth.clientSecret"),
        });

        const apiUrl = `${this.configService.get("keycloak.baseUrl")}/realms/${this.configService.get("keycloak.realm")}/protocol/openid-connect/token/introspect`;

        try {
            const { data }: { data: KeyCloakTokenIntrospectRsp } = await lastValueFrom(
                this.httpService.post(apiUrl, params, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }),
            );

            const { active, sub } = data || {};

            if (!active || !sub) {
                return undefined;
            }

            return data;
        } catch (e) {
            throw e;
        }
    }
}
