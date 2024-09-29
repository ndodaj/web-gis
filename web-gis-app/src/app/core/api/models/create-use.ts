export interface CreateUser {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  regionalDirectorateId: string;
  nid: string;
  clearTextPassword: string;
  roleIds: string[];
}
