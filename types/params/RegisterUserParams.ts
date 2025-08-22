export interface RegisterUserParams {
  name: string;
  email: string;
  username: string;
  password: string;
  roles?: string[]; // optional, default to ['user']
}
