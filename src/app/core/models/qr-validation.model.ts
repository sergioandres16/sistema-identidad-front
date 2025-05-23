export interface QrValidationRequest {
  qrToken: string;
  zoneId: number;
  scannerId: string;
  scannerLocation: string;
}

export interface QrValidationResponse {
  valid: boolean;
  userId: number;
  userName: string;
  userStatus: string;
  statusColor: string;
  userRole: string;
  profilePhoto: string;
  accessGranted: boolean;
  reasonDenied: string;
  logId: number;
}
