import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor
  ],
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  // aquí irá la lista de usuarios cuando la implementes
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Load users from the service
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers()
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (err) => {
          console.error('Error loading users:', err);
        }
      });
  }
}
