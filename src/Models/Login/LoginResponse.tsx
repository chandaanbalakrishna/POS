export interface LoginResponse {
  token: string;
  expiration: Date;
  userRoles: string;
  userName:string;
  employeeId: number;
  empPhoto: string;
  versionCode:string;
}



