// src/app/access-logs/log-detail/log-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccessLogService } from '../../core/services/access-log.service';
import { AccessLog } from '../../core/models/access-log.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-log-detail',
  templateUrl: './log-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  styleUrls: ['./log-detail.component.scss']
})
export class LogDetailComponent implements OnInit {
  logId: number | null = null;
  log: AccessLog | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accessLogService: AccessLogService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.logId = +idParam;
      this.loadLogDetails();
    } else {
      this.error = 'ID de registro no encontrado';
    }
  }

  loadLogDetails(): void {
    // Simulamos obtener un log individual por ID - esto deberíamos adaptar del otro método
    // En caso de que no exista un endpoint directo para obtener un log por ID, podríamos
    // obtener los logs del usuario y filtrar por el ID específico
    this.isLoading = true;

    // Implementación ejemplo (deberás ajustar según los logs que tengas disponibles)
    this.isLoading = false;
    this.error = 'Este componente está en desarrollo. Por favor, regresa al listado.';

    // Nota: Si hubiera un endpoint para obtener un log específico por ID, se usaría así:
    /*
    this.accessLogService.getLogById(this.logId)
      .subscribe({
        next: (log) => {
          this.log = log;
          this.isLoading = false;
          this.error = null;
        },
        error: (err) => {
          this.error = 'Error al cargar el registro de acceso';
          this.isLoading = false;
        }
      });
    */
  }

  goBack(): void {
    this.router.navigate(['/access-logs']);
  }

  getAccessStatusClass(granted: boolean | undefined): string {
    if (granted === undefined) return '';
    return granted ? 'status-granted' : 'status-denied';
  }
}
