import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'shared-lib';
import { RoleBadgeColorPipe } from 'shared-lib';
import { StatusLabelPipe } from 'shared-lib';
import { LoadingSpinnerComponent } from 'shared-lib';
import { UserService } from '../services/user.service';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';

@Component({
  selector: 'lib-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    RoleBadgeColorPipe,
    StatusLabelPipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  loading = false;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadUser(id);
    });
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe((user: any) => {
      this.user = user;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  openEditDialog(): void {
    if (!this.user) return;

    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { mode: 'edit', user: this.user },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.user) {
        this.userService.updateUser(this.user.id, result).subscribe(() => {
          this.loadUser(this.user!.id);
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
