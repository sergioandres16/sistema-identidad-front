import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Detalle de usuario</h2>
    <p>Este componente se mostrará pronto…</p>
  `
})
export class UserDetailComponent implements OnInit {
  userId: number | null = null;
  user: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = +idParam;
      this.loadUser();
    }
  }

  loadUser(): void {
    if (!this.userId) return;

    this.userService.getUserById(this.userId)
      .subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (err) => {
          console.error('Error loading user:', err);
        }
      });
  }
}
