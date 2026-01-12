export interface IRole {
  role_id: number;
  name: string; // 'ADMIN' | 'REGULAR'
}

export interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface IUserProfile extends IUser {
  role: string;
  phoneNumber: string | null;
  newsletterOptIn: boolean | null;
  preferredGenreId: number | null;
}
