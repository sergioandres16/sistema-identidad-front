// src/app/access-logs/log-list/log-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccessLogService } from '../../core/services/access-log.service';
import { AuthService } from '../../core/services/auth.service';
import { AccessLog } from '../../core/models/access-log.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    NgClass,
    DatePipe,
    RouterModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  styleUrls: ['./log-list.component.scss']
})
export class LogListComponent implements OnInit {
  accessLogs: AccessLog[] = [];
  isLoading = false;
  error: string | null = null;
  isAdmin = false;
  filterForm: FormGroup;

  // Parámetros de paginación
  currentPage = 0;
  pageSize = 20;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private accessLogService: AccessLogService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.filterForm = this.formBuilder.group({
      userId: [''],
      startDate: [''],
      endDate: [''],
      zoneId: [''],
      accessGranted: ['']
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadLogs();

    // Suscribirse a cambios en el formulario para aplicar filtros
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 0; // Resetear a primera página al filtrar
      this.loadLogs();
    });
  }

  loadLogs(): void {
    this.isLoading = true;

    const userId = this.filterForm.value.userId || this.authService.userId;

    // Para usuarios normales, solo mostrar sus propios logs
    if (!this.isAdmin) {
      this.loadUserLogs(userId);
      return;
    }

    // Para administradores, permitir filtrado avanzado
    const startDate = this.filterForm.value.startDate ? new Date(this.filterForm.value.startDate) : null;
    const endDate = this.filterForm.value.endDate ? new Date(this.filterForm.value.endDate) : null;

    if (startDate && endDate) {
      this.loadLogsByDateRange(startDate, endDate);
    } else {
      this.loadUserLogs(userId);
    }
  }

  loadUserLogs(userId: number): void {
    this.accessLogService.getUserAccessHistory(userId, this.pageSize)
      .subscribe({
        next: (logs) => {
          this.accessLogs = logs;
          this.isLoading = false;
          this.error = null;
        },
        error: (err) => {
          this.error = 'Error al cargar el historial de accesos';
          this.isLoading = false;
          this.accessLogs = [];
        }
      });
  }

  loadLogsByDateRange(startDate: Date, endDate: Date): void {
    this.accessLogService.getAccessLogsByDateRange(startDate, endDate)
      .subscribe({
        next: (logs) => {
          this.accessLogs = logs;
          this.isLoading = false;
          this.error = null;
        },
        error: (err) => {
          this.error = 'Error al cargar el historial de accesos para el rango de fechas';
          this.isLoading = false;
          this.accessLogs = [];
        }
      });
  }

  getAccessStatusClass(granted: boolean): string {
    return granted ? 'access-granted' : 'access-denied';
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.loadLogs();
  }
}
