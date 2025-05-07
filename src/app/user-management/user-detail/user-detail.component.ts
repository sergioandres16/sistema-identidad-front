// src/app/user-management/user-detail/user-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgClass, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { CardService } from '../../core/services/card.service';
import { Card } from '../../core/models/card.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  userId: number | null = null;
  user: User | null = null;
  card: Card | null = null;
  isLoading = false;
  error: string | null = null;
  isCardLoading = false;
  cardError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = +idParam;
      this.loadUser();
      this.loadUserCard();
    } else {
      this.error = 'ID de usuario no encontrado';
    }
  }

  loadUser(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.userService.getUserById(this.userId)
      .subscribe({
        next: (user) => {
          this.user = user;
          this.isLoading = false;
          this.error = null;
        },
        error: (err) => {
          this.error = 'Error al cargar el usuario: ' + err.message;
          this.isLoading = false;
        }
      });
  }

  loadUserCard(): void {
    if (!this.userId) return;

    this.isCardLoading = true;
    this.cardService.getCardByUserId(this.userId)
      .subscribe({
        next: (card) => {
          this.card = card;
          this.isCardLoading = false;
          this.cardError = null;
        },
        error: (err) => {
          this.cardError = 'No se pudo cargar el carnet digital';
          this.isCardLoading = false;
        }
      });
  }

  onEdit(): void {
    if (this.userId) {
      this.router.navigate(['/user-management', this.userId, 'edit']);
    }
  }

  getProfilePhotoUrl(): string {
    if (this.user && this.user.profilePhoto) {
      if (typeof this.user.profilePhoto === 'string' &&
        this.user.profilePhoto.startsWith('data:image')) {
        return this.user.profilePhoto;
      } else {
        return 'data:image/jpeg;base64,' + this.user.profilePhoto;
      }
    }
    return '/assets/images/profile-placeholder.png';
  }

  getStatusClass(): string {
    if (!this.user?.statusName) return '';

    switch (this.user.statusName) {
      case 'ACTIVE': return 'status-active';
      case 'INACTIVE': return 'status-inactive';
      case 'SUSPENDED': return 'status-suspended';
      case 'DEBT': return 'status-debt';
      case 'EXPIRED': return 'status-expired';
      default: return '';
    }
  }
}
