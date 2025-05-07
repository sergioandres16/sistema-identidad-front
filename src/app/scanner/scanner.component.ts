// src/app/scanner/scanner.component.ts
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccessLogService } from '../core/services/access-log.service';
import { NgxScannerQrcodeComponent, LOAD_WASM } from 'ngx-scanner-qrcode';
import { QrValidationResponse } from '../core/models/qr-validation.model';
import { Subscription, interval } from 'rxjs';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner/loading-spinner.component';
import { UserService } from '../core/services/user.service';


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
    LoadingSpinnerComponent
  ],
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit, OnDestroy {
  @ViewChild('scanner') scanner: NgxScannerQrcodeComponent | null = null;

  scannerForm: FormGroup;
  isScannerRunning = false;
  isLoading = false;
  error: string | null = null;
  scanResult: QrValidationResponse | null = null;
  zones = [
    { id: 1, name: 'MAIN_ENTRANCE', description: 'Entrada Principal' },
    { id: 2, name: 'LIBRARY', description: 'Biblioteca' },
    { id: 3, name: 'CAFETERIA', description: 'Cafetería' },
    { id: 4, name: 'COMPUTER_LAB', description: 'Laboratorio de Informática' },
    { id: 5, name: 'ADMIN_OFFICE', description: 'Oficinas Administrativas' },
    { id: 6, name: 'GYMNASIUM', description: 'Gimnasio' }
  ];
  statusChanging = false;
  statusChangeSuccess: boolean | null = null;
  statusChangeMessage: string = '';
  autoScanTimer: number | null = null;

  private scanSubscription: Subscription | null = null;
  private autoResetSubscription: Subscription | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private accessLogService: AccessLogService,
    private userService: UserService
  ) {
    this.scannerForm = this.formBuilder.group({
      zoneId: [1, Validators.required],
      scannerId: ['SCANNER_' + Math.floor(Math.random() * 1000), Validators.required],
      scannerLocation: ['Entrada Principal', Validators.required],
      autoReset: [true]
    });
  }

  ngOnInit(): void {
    // Si quisiéramos cargar zonas desde el backend:
    /*
    this.loadAccessZones();
    */

    // Iniciar temporizador para autoescaneo si está habilitado
    if (this.scannerForm.value.autoReset) {
      this.startAutoResetTimer();
    }

    // Suscribirse a cambios en la opción de autoreset
    this.scannerForm.get('autoReset')?.valueChanges.subscribe(value => {
      if (value) {
        this.startAutoResetTimer();
      } else {
        this.stopAutoResetTimer();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopScanner();
    this.stopAutoResetTimer();

    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe();
    }

    if (this.autoResetSubscription) {
      this.autoResetSubscription.unsubscribe();
    }
  }

  startScanner(): void {
    if (this.scanner && !this.isScannerRunning) {
      this.scanner.start();
      this.isScannerRunning = true;
      this.error = null;
      this.scanResult = null;

      this.scanSubscription = this.scanner.data.subscribe((result) => {
        if (result && result.length > 0 && result[0].value) {
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

      if (this.scanSubscription) {
        this.scanSubscription.unsubscribe();
        this.scanSubscription = null;
      }
    }
  }

  onScanSuccess(qrString: string): void {
    this.stopScanner();

    let tokenValue = qrString;
    const jwtPattern = /^(Bearer\s+)?([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)$/;

    const match = qrString.match(jwtPattern);
    if (match) {
      tokenValue = match[2];
    }

    this.validateQrCode(tokenValue);
  }

  validateQrCode(qrToken: string): void {
    this.isLoading = true;
    this.error = null;

    const zoneId = this.scannerForm.value.zoneId;
    const scannerId = this.scannerForm.value.scannerId;
    const scannerLocation = this.scannerForm.value.scannerLocation;

    this.accessLogService.validateQrCode(qrToken, zoneId, scannerId, scannerLocation)
      .subscribe({
        next: (result) => {
          this.scanResult = result;
          this.isLoading = false;

          // Si está configurado el autoreset, programar un reinicio automático después de unos segundos
          if (this.scannerForm.value.autoReset && !this.scanResult.accessGranted) {
            this.resetScannerAfterDelay(5000); // 5 segundos para ver el resultado negativo
          }
        },
        error: (err) => {
          console.error('Error al validar QR:', err);
          this.error = 'Error al validar el código QR: ' + (err.message || 'Error desconocido');
          this.isLoading = false;
          this.scanResult = null;

          // En caso de error, resetear después de un tiempo si está habilitado
          if (this.scannerForm.value.autoReset) {
            this.resetScannerAfterDelay(3000);
          }
        }
      });
  }

  changeUserStatus(userId: number, newStatusId: number): void {
    this.statusChanging = true;
    this.statusChangeSuccess = null;
    this.statusChangeMessage = '';

    const zoneId = this.scannerForm.value.zoneId;

    this.accessLogService.changeUserStatusOnAccess(userId, zoneId, newStatusId)
      .subscribe({
        next: (result) => {
          if (this.scanResult) {
            this.scanResult.userStatus = this.getStatusNameById(newStatusId);
          }
          this.statusChanging = false;
          this.statusChangeSuccess = true;
          this.statusChangeMessage = 'Estado actualizado con éxito';

          // Programar desaparición del mensaje después de unos segundos
          setTimeout(() => {
            this.statusChangeSuccess = null;
            this.statusChangeMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Error al cambiar estado:', err);
          this.statusChanging = false;
          this.statusChangeSuccess = false;
          this.statusChangeMessage = 'Error al cambiar el estado: ' + (err.message || 'Error desconocido');
        }
      });
  }

  resetScanner(): void {
    this.scanResult = null;
    this.error = null;
    this.statusChangeSuccess = null;
    this.statusChangeMessage = '';
    this.startScanner();
  }

  resetScannerAfterDelay(delay: number): void {
    setTimeout(() => {
      this.resetScanner();
    }, delay);
  }

  startAutoResetTimer(): void {
    // Detener temporizador existente si hay uno
    this.stopAutoResetTimer();

    // Iniciar un temporizador que resetea el escáner después de un período de inactividad (30 segundos)
    this.autoResetSubscription = interval(1000).subscribe(() => {
      if (!this.isScannerRunning && !this.isLoading && this.scanResult) {
        if (this.autoScanTimer === null) {
          this.autoScanTimer = 30; // 30 segundos para resetear
        } else if (this.autoScanTimer > 0) {
          this.autoScanTimer--;
        } else {
          // Tiempo agotado, resetear el escáner
          this.resetScanner();
          this.autoScanTimer = null;
        }
      } else {
        this.autoScanTimer = null;
      }
    });
  }

  stopAutoResetTimer(): void {
    if (this.autoResetSubscription) {
      this.autoResetSubscription.unsubscribe();
      this.autoResetSubscription = null;
    }
    this.autoScanTimer = null;
  }

  getAccessResultClass(): string {
    if (!this.scanResult) return '';

    return this.scanResult.accessGranted ? 'access-granted' : 'access-denied';
  }

  getUserStatusClass(): string {
    if (!this.scanResult) return '';

    switch (this.scanResult.userStatus) {
      case 'ACTIVE':
        return 'status-active';
      case 'INACTIVE':
        return 'status-inactive';
      case 'SUSPENDED':
        return 'status-suspended';
      case 'DEBT':
        return 'status-debt';
      case 'PENDING':
        return 'status-pending';
      case 'EXPIRED':
        return 'status-expired';
      default:
        return '';
    }
  }

  getStatusNameById(statusId: number): string {
    switch (statusId) {
      case 1:
        return 'ACTIVE';
      case 2:
        return 'INACTIVE';
      case 3:
        return 'SUSPENDED';
      case 4:
        return 'PENDING';
      case 5:
        return 'EXPIRED';
      case 6:
        return 'DEBT';
      default:
        return 'UNKNOWN';
    }
  }

  getAutoResetText(): string {
    if (this.autoScanTimer !== null) {
      return `Auto-reset en ${this.autoScanTimer}s`;
    }
    return 'Auto-reset';
  }
}
