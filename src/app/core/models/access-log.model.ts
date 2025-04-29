export interface AccessLog {
  id: number;
  userId: number;
  userName: string;
  zoneId?: number;
  zoneName?: string;
  accessTime: Date;
  accessGranted: boolean;
  accessType: string;
  scannerId?: string;
  scannerLocation?: string;
  reasonDenied?: string;
  previousStatus?: string;
  updatedStatus?: string;
}
