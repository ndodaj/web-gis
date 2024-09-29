import { RolesDto } from './roles-dto';

export type EditRoles = Pick<
  RolesDto,
  'code' | 'id' | 'isActive' | 'name' | 'permissionsIds'
>;
