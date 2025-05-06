export interface Card {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  cardNumber: string;
  issueDate: Date;
  expiryDate: Date;
  isActive: boolean;
  status: string;
  statusColor: string;
  role: string;
  qrCodeBase64: string;
}
