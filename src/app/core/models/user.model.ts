export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePhoto?: string;
  statusName?: string;
  statusColor?: string;
  roles?: string[];
  studentCode?: string;
  faculty?: string;
  membershipType?: string;
  membershipExpiry?: Date;
  hasDebt?: boolean;
}
