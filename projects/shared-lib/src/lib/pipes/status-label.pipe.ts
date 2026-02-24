import { Pipe, PipeTransform } from '@angular/core';
import { UserStatus } from '../models/user.model';

@Pipe({
  name: 'statusLabel',
  standalone: true,
})
export class StatusLabelPipe implements PipeTransform {
  transform(status: UserStatus): string {
    return status === 'active' ? 'Active' : 'Inactive';
  }
}
