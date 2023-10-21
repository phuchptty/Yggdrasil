import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";
import { KcClientModule } from "../external/kc-client/kc-client.module";
import { UserResolver } from './user.resolver';

@Module({
    providers: [UserService, UserResolver],
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
        KcClientModule,
    ],
})
export class UserModule {}
