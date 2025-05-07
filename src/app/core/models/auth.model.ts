export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  studentCode?: string;
  faculty?: string;
  membershipType?: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
