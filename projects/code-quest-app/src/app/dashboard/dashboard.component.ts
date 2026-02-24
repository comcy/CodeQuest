import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { User } from 'shared-lib';
import { UserService } from 'users-lib';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  admins: number;
  editors: number;
  viewers: number;
  departments: { name: string; count: number }[];
  recentUsers: User[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    admins: 0,
    editors: 0,
    viewers: 0,
    departments: [],
    recentUsers: [],
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.stats.totalUsers = users.length;
      this.stats.activeUsers = users.filter(u => u.status === 'active').length;
      this.stats.inactiveUsers = users.filter(u => u.status === 'inactive').length;
      this.stats.admins = users.filter(u => u.role === 'admin').length;
      this.stats.editors = users.filter(u => u.role === 'editor').length;
      this.stats.viewers = users.filter(u => u.role === 'viewer').length;

      // Calculate department stats
      const deptMap = new Map<string, number>();
      users.forEach(u => deptMap.set(u.department, (deptMap.get(u.department) || 0) + 1));
      this.stats.departments = Array.from(deptMap.entries()).map(([name, count]) => ({ name, count }));

      // Recent users (last 5)
      this.stats.recentUsers = users
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    });
  }
}
