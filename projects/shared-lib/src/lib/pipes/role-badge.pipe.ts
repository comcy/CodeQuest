import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '../models/user.model';

@Pipe({
  name: 'roleBadgeColor',
  standalone: true,
})
export class RoleBadgeColorPipe implements PipeTransform {
  transform(role: UserRole): string {
    switch (role) {
      case 'admin':
        return '#d32f2f';
      case 'editor':
        return '#1976d2';
      case 'viewer':
        return '#388e3c';
      default:
        return '#757575';
    }
  }
}
