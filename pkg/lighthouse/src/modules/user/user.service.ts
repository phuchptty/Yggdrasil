import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { KcClientService } from "../external/kc-client/kc-client.service";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly kcClient: KcClientService) {}

    async queryMe(userId: string) {
        return this.userModel.findOne({ _id: userId }).lean().exec();
    }
}
