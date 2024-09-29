import { GetUsersRoleDto } from './get-users-role-dto';

export interface GetUserResponseDto {
  userDto: {
    id: string;
    firstname: string;
    lastname: string;
    userName: string;
    regionalDirectorateId: string;
    nid: string;
    email: string;
    created: string;
    roles: GetUsersRoleDto[];
  };
}
