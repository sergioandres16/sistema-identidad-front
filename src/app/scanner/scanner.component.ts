// src/app/scanner/scanner.component.ts con correcciones de TypeScript

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccessLogService } from '../core/services/access-log.service';
import { CardService } from '../core/services/card.service';
import {
  NgxScannerQrcodeComponent,
  LOAD_WASM,
} from 'ngx-scanner-qrcode';
import { QrValidationResponse } from '../core/models/qr-validation.model';
import { Subscription, interval, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner/loading-spinner.component';
import { UserService } from '../core/services/user.service';
import { AuthService } from '../core/services/auth.service';

LOAD_WASM().subscribe((res: any) => {
  console.log('WASM loaded', res);
});

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    NgClass,
    ReactiveFormsModule,
    NgxScannerQrcodeComponent,
    LoadingSpinnerComponent,
  ],
  styleUrls: ['./scanner.component.scss'],
})
export class ScannerComponent implements OnInit, OnDestroy {
  @ViewChild('scanner') scanner: NgxScannerQrcodeComponent | null = null;

  scannerForm: FormGroup;
  isScannerRunning = false;
  isLoading = false;
  error: string | null = null;
  scanResult: QrValidationResponse | null = null;
  cardDetails: any = null;

  zones = [
    { id: 1, name: 'MAIN_ENTRANCE', description: 'Entrada Principal' },
    { id: 2, name: 'LIBRARY', description: 'Biblioteca' },
    { id: 3, name: 'CAFETERIA', description: 'Cafetería' },
    { id: 4, name: 'COMPUTER_LAB', description: 'Laboratorio de Informática' },
    { id: 5, name: 'ADMIN_OFFICE', description: 'Oficinas Administrativas' },
    { id: 6, name: 'GYMNASIUM', description: 'Gimnasio' },
  ];

  statusChanging = false;
  statusChangeSuccess: boolean | null = null;
  statusChangeMessage = '';
  autoScanTimer: number | null = null;
  tokenFromUrl: string | null = null;

  isAdminOrScanner = false;

  debug: any = {};

  private scanSubscription: Subscription | null = null;
  private autoResetSubscription: Subscription | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private accessLogService: AccessLogService,
    private userService: UserService,
    private authService: AuthService,
    private cardService: CardService,
    private route: ActivatedRoute
  ) {
    this.scannerForm = this.formBuilder.group({
      zoneId: [1, Validators.required],
      scannerId: [
        'SCANNER_' + Math.floor(Math.random() * 1000),
        Validators.required,
      ],
      scannerLocation: ['Entrada Principal', Validators.required],
      autoReset: [true],
    });
  }

  ngOnInit(): void {
    this.isAdminOrScanner = this.authService.isAdmin() || this.authService.isScanner();
    console.log('Usuario es admin o scanner:', this.isAdminOrScanner);

    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        const token = params['token'];
        this.tokenFromUrl = token;
        localStorage.setItem('scannedToken', token);
        console.log('Token recibido desde URL:', token);
        this.validateQrCode(token);
      }
    });

    if (this.scannerForm.value.autoReset) {
      this.startAutoResetTimer();
    }

    this.scannerForm.get('autoReset')?.valueChanges.subscribe((value) =>
      value ? this.startAutoResetTimer() : this.stopAutoResetTimer()
    );
  }

  ngOnDestroy(): void {
    this.stopScanner();
    this.stopAutoResetTimer();
    this.scanSubscription?.unsubscribe();
    this.autoResetSubscription?.unsubscribe();
  }

  startScanner(): void {
    if (this.scanner && !this.isScannerRunning) {
      this.scanner.start();
      this.isScannerRunning = true;
      this.error = null;
      this.scanResult = null;
      this.cardDetails = null;

      this.scanSubscription = this.scanner.data.subscribe((result) => {
        if (result?.length && result[0].value) {
          const qrValue = result[0].value;
          console.log('QR detectado:', qrValue);
          this.onScanSuccess(qrValue);
        }
      });
    }
  }

  stopScanner(): void {
    if (this.scanner && this.isScannerRunning) {
      this.scanner.stop();
      this.isScannerRunning = false;
      this.scanSubscription?.unsubscribe();
      this.scanSubscription = null;
    }
  }

  onScanSuccess(qrString: string): void {
    this.stopScanner();

    let tokenValue = qrString;
    const jwtPattern =
      /^(Bearer\s+)?([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)$/;

    const match = qrString.match(jwtPattern);
    if (match) {
      tokenValue = match[2];
    }

    if (!this.isRunningInApp()) {
      try {
        const base64Url = tokenValue.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        if (payload.redirectUrl) {
          window.location.href = payload.redirectUrl + tokenValue;
          return;
        }
      } catch (e) {
        console.error('Error parsing JWT token:', e);
      }

      window.location.href =
        'http://192.168.18.45:4200/scanner?token=' + tokenValue;
      return;
    }

    this.validateQrCode(tokenValue);
  }

  private isRunningInApp(): boolean {
    return (
      window.location.href.includes('localhost:4200') ||
      window.location.href.includes('192.168.18.45:4200') ||
      window.location.href.includes('/scanner') ||
      window.location.href.includes('/dashboard')
    );
  }

  validateQrCode(qrToken: string): void {
    if (!qrToken) {
      this.error = 'No se proporcionó un token QR válido';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { zoneId, scannerId, scannerLocation } = this.scannerForm.value;

    console.log('Validando QR con parámetros:', {
      qrToken,
      zoneId,
      scannerId,
      scannerLocation,
      isAdminOrScanner: this.isAdminOrScanner
    });

    // Primero validamos el QR para obtener el ID del usuario
    this.accessLogService
      .validateQrCode(qrToken, zoneId, scannerId, scannerLocation)
      .pipe(
        // Si hay éxito, intentamos cargar los detalles del carnet
        switchMap(result => {
          this.scanResult = result;
          console.log('QR validado correctamente:', result);

          // Si tenemos un ID de usuario, intentamos cargar su carnet
          if (result && result.userId) {
            console.log('Cargando detalles del carnet para usuario:', result.userId);
            return this.cardService.getCardByUserId(result.userId).pipe(
              catchError(err => {
                console.error('Error cargando carnet:', err);
                // Si hay error al cargar el carnet, simplemente devolvemos null
                return of(null);
              })
            );
          }
          return of(null);
        })
      )
      .subscribe({
        next: (cardData) => {
          this.isLoading = false;

          if (cardData) {
            console.log('Carnet cargado correctamente:', cardData);
            this.cardDetails = cardData;
            this.debug.cardDetails = cardData;
          } else {
            console.log('No se pudo cargar información del carnet');
          }

          if (this.scannerForm.value.autoReset && this.scanResult && !this.scanResult.accessGranted) {
            this.resetScannerAfterDelay(5000);
          }
        },
        error: (err) => {
          console.error('Error al validar QR:', err);
          this.error =
            'Error al validar el código QR: ' +
            (err.message || 'Error desconocido');
          this.isLoading = false;
          this.scanResult = null;
          this.cardDetails = null;

          if (this.scannerForm.value.autoReset) {
            this.resetScannerAfterDelay(3000);
          }
        },
      });
  }

  activateUserCard(): void {
    if (!this.scanResult || !this.scanResult.userId) {
      this.error = 'No hay información de usuario para activar';
      return;
    }

    this.statusChanging = true;
    this.statusChangeSuccess = null;
    this.statusChangeMessage = '';

    const { zoneId, scannerId, scannerLocation } = this.scannerForm.value;

    console.log('Activando carnet para usuario:', this.scanResult.userId);

    this.accessLogService
      .activateUserCard(this.scanResult.userId, zoneId, scannerId, scannerLocation)
      .subscribe({
        next: (result) => {
          console.log('Carnet activado correctamente:', result);

          // Actualizar la información del usuario escaneado
          if (result && result.userStatus && this.scanResult) {
            this.scanResult.userStatus = result.userStatus;
            this.scanResult.accessGranted = true;
            // No asignar null directamente a reasonDenied
            this.scanResult.reasonDenied = '';
          }

          // Recargar los detalles del carnet para mostrar el estado actualizado
          if (this.scanResult && this.scanResult.userId) {
            this.cardService.getCardByUserId(this.scanResult.userId).subscribe({
              next: (cardData) => {
                console.log('Carnet recargado después de activación:', cardData);
                this.cardDetails = cardData;
                this.debug.reloadedCardDetails = cardData;
              },
              error: (error) => console.error('Error recargando carnet después de activación:', error)
            });
          }

          this.statusChanging = false;
          this.statusChangeSuccess = true;
          this.statusChangeMessage = 'Carnet activado con éxito. Válido por 8 horas.';

          setTimeout(() => {
            this.statusChangeSuccess = null;
            this.statusChangeMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Error al activar carnet:', err);
          this.statusChanging = false;
          this.statusChangeSuccess = false;
          this.statusChangeMessage = 'Error al activar el carnet: ' + (err.message || 'Error desconocido');
        }
      });
  }

  changeUserStatus(userId: number, newStatusId: number): void {
    this.statusChanging = true;
    this.statusChangeSuccess = null;
    this.statusChangeMessage = '';

    const zoneId = this.scannerForm.value.zoneId;

    // Si es activación (estado ACTIVE con ID 1), usar el nuevo endpoint
    if (newStatusId === 1) {
      this.activateUserCard();
      return;
    }

    this.accessLogService
      .changeUserStatusOnAccess(userId, zoneId, newStatusId)
      .subscribe({
        next: () => {
          if (this.scanResult) {
            this.scanResult.userStatus = this.getStatusNameById(newStatusId);
          }

          // Recargar los detalles del carnet después de cambiar el estado
          if (this.scanResult && this.scanResult.userId) {
            this.cardService.getCardByUserId(this.scanResult.userId).subscribe({
              next: (cardData) => {
                console.log('Carnet recargado después de cambio de estado:', cardData);
                this.cardDetails = cardData;
              },
              error: (error) => console.error('Error recargando carnet después de cambio de estado:', error)
            });
          }

          this.statusChanging = false;
          this.statusChangeSuccess = true;
          this.statusChangeMessage = 'Estado actualizado con éxito';

          setTimeout(() => {
            this.statusChangeSuccess = null;
            this.statusChangeMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Error al cambiar estado:', err);
          this.statusChanging = false;
          this.statusChangeSuccess = false;
          this.statusChangeMessage =
            'Error al cambiar el estado: ' +
            (err.message || 'Error desconocido');
        },
      });
  }

  resetScanner(): void {
    this.scanResult = null;
    this.cardDetails = null;
    this.error = null;
    this.statusChangeSuccess = null;
    this.statusChangeMessage = '';
    this.startScanner();
  }

  resetScannerAfterDelay(delay: number): void {
    setTimeout(() => this.resetScanner(), delay);
  }

  startAutoResetTimer(): void {
    this.stopAutoResetTimer();
    this.autoResetSubscription = interval(1000).subscribe(() => {
      if (!this.isScannerRunning && !this.isLoading && this.scanResult) {
        if (this.autoScanTimer === null) {
          this.autoScanTimer = 30;
        } else if (this.autoScanTimer > 0) {
          this.autoScanTimer--;
        } else {
          this.resetScanner();
          this.autoScanTimer = null;
        }
      } else {
        this.autoScanTimer = null;
      }
    });
  }

  stopAutoResetTimer(): void {
    this.autoResetSubscription?.unsubscribe();
    this.autoResetSubscription = null;
    this.autoScanTimer = null;
  }

  getAccessResultClass(): string {
    if (!this.scanResult) return '';
    return this.scanResult.accessGranted ? 'access-granted' : 'access-denied';
  }

  getUserStatusClass(): string {
    if (!this.scanResult) return '';
    switch (this.scanResult.userStatus) {
      case 'ACTIVE': return 'status-active';
      case 'INACTIVE': return 'status-inactive';
      case 'SUSPENDED': return 'status-suspended';
      case 'DEBT': return 'status-debt';
      case 'PENDING': return 'status-pending';
      case 'EXPIRED': return 'status-expired';
      default: return '';
    }
  }

  getStatusNameById(statusId: number): string {
    switch (statusId) {
      case 1: return 'ACTIVE';
      case 2: return 'INACTIVE';
      case 3: return 'SUSPENDED';
      case 4: return 'PENDING';
      case 5: return 'EXPIRED';
      case 6: return 'DEBT';
      default: return 'UNKNOWN';
    }
  }

  getAutoResetText(): string {
    return this.autoScanTimer !== null
      ? `Auto-reset en ${this.autoScanTimer}s`
      : 'Auto-reset';
  }

  needsActivation(): boolean {
    if (!this.scanResult || !this.scanResult.userStatus) return false;

    const status = this.scanResult.userStatus;
    return status === 'EXPIRED' || status === 'INACTIVE' || status === 'PENDING';
  }

  canActivateCards(): boolean {
    return this.isAdminOrScanner;
  }

  // Método para depuración
  getDebugInfo(): string {
    return JSON.stringify({
      scanResult: this.scanResult,
      cardDetails: this.cardDetails,
      isAdminOrScanner: this.isAdminOrScanner
    }, null, 2);
  }
}
