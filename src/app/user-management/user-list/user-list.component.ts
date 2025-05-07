// src/app/user-management/user-list/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  isAdmin = false;
  filterForm: FormGroup;

  // Parámetros de paginación
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.filterForm = this.formBuilder.group({
      search: [''],
      role: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    if (!this.isAdmin) {
      this.error = 'No tienes permiso para acceder a esta sección';
      return;
    }

    this.loadUsers();

    // Suscribirse a cambios en el formulario para filtrar
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 0; // Resetear a primera página al filtrar
      this.loadUsers();
    });
  }

  loadUsers(): void {
    this.isLoading = true;

    // Si quisiéramos implementar paginación con filtrado:
    /*
    this.userService.getPaginatedUsers(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.users = response.users;
          this.currentPage = response.currentPage;
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
          this.isLoading = false;
          this.error = null;
        },
        error: (err) => {
          this.error = 'Error al cargar usuarios';
          this.isLoading = false;
          this.users = [];
        }
      });
    */

    // Implementación actual sin paginación:
    this.userService.getAllUsers()
      .subscribe({
        next: (users) => {
          this.users = users;
          this.isLoading = false;
          this.error = null;

          // Aplicar filtros manualmente si es necesario
          this.applyFilters();
        },
        error: (err) => {
          this.error = 'Error al cargar usuarios: ' + err.message;
          this.isLoading = false;
          this.users = [];
        }
      });
  }

  applyFilters(): void {
    const searchTerm = this.filterForm.value.search?.toLowerCase() || '';
    const role = this.filterForm.value.role || '';
    const status = this.filterForm.value.status || '';

    let filteredUsers = [...this.users];

    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user =>
        user.username?.toLowerCase().includes(searchTerm) ||
        user.firstName?.toLowerCase().includes(searchTerm) ||
        user.lastName?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm)
      );
    }

    if (role) {
      filteredUsers = filteredUsers.filter(user =>
        user.roles?.includes(role)
      );
    }

    if (status) {
      filteredUsers = filteredUsers.filter(user =>
        user.statusName === status
      );
    }

    this.users = filteredUsers;
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.loadUsers();
  }

  getStatusClass(statusName: string | undefined): string {
    if (!statusName) return '';

    switch (statusName) {
      case 'ACTIVE': return 'status-active';
      case 'INACTIVE': return 'status-inactive';
      case 'SUSPENDED': return 'status-suspended';
      case 'DEBT': return 'status-debt';
      case 'EXPIRED': return 'status-expired';
      default: return '';
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }
}
