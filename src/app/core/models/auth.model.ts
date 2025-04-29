/**
 *  Modelos usados por AuthService y los componentes de
 *  login / register.  Añade o ajusta campos cuando
 *  integres el back-end real.
 */

/* ---------- peticiones ---------- */
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

  /* campos opcionales para tipos de usuario específicos */
  studentCode?: string;
  faculty?: string;
  membershipType?: string;
}

/* ---------- respuestas ---------- */
export interface LoginResponse {
  token: string;
  tokenType: string;      // p.e. "Bearer"
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;           // ROLE_USER | ROLE_ADMIN | …
}
