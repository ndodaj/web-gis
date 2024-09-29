import { GetUsersRoleDto } from './get-users-role-dto';

export interface CurrentUserWithRolesDto {
  id: string;
  firstname: string;
  lastname: string;
  userName: string;
  email: string;
  regionalDirectorateName: string;
  created: string;
  roles: GetUsersRoleDto[];
}
