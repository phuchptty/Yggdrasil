import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { KcClientService } from "../external/kc-client/kc-client.service";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly kcClient: KcClientService) {}

    async queryMe(userId: string) {
        const user = await this.kcClient.getUser(userId);
        const userGroups = await this.kcClient.getUserGroups(userId);

        return {
            _id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: userGroups.map((group) => group.name),
        };
    }
}
