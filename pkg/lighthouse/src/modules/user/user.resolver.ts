import { Query, Resolver } from "@nestjs/graphql";
import { User } from "./schema/user.schema";
import { UserService } from "./user.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth/auth.guard";
import { UserId } from "../../decorators/user-id/user-id.decorator";

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => User, { name: "Profile_me" })
    @UseGuards(AuthGuard)
    async me(@UserId() userId: string) {
        return this.userService.queryMe(userId);
    }
}
