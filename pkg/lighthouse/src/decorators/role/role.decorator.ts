import { RoleEnum } from '../../commons/enums';
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export const Role = (...args: RoleEnum[]) => SetMetadata(ROLES_KEY, args);
