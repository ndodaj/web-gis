import { RolesDto } from './roles-dto';

export type CreateRoles = Pick<
  RolesDto,
  'code' | 'name' | 'permissionsIds'
>;
