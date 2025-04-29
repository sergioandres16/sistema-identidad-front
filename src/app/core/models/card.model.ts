export interface Card {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  profilePhoto?: string; // Base64 encoded
  cardNumber: string;
  issueDate: Date;
  expiryDate: Date;
  isActive: boolean;
  status: string;
  statusColor: string;
  role: string;
  qrCodeBase64: string;
}
