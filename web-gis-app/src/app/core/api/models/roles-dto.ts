export interface RolesDto {
  id: string;
  code: string;
  name: string;
  permissionsIds: string[];
  isActive: boolean;
  createdOn: string;
}
