import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { User } from 'shared-lib';

export interface UserFormDialogData {
  mode: 'create' | 'edit';
  user?: User;
}

@Component({
  selector: 'lib-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
})
export class UserFormDialogComponent implements OnInit {
  data = inject<UserFormDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<UserFormDialogComponent>);
  private fb = inject(FormBuilder);

  /**
   * TS-CHALLENGE-6 ─ Typed Reactive Forms
   *
   * Angular supports *strongly-typed* reactive forms since v14. The current
   * declaration uses the legacy untyped `FormGroup`, which means `.value` and
   * `.controls` are typed as `any`.
   *
   * Task A – Type the form:
   *   Replace `FormGroup` with a fully-typed equivalent.
   *   Import `FormModel` and `UserFormFields` from `shared-lib/utils/type.utils`
   *   and declare the property as:
   *
   *     form!: FormGroup<FormModel<UserFormFields>>;
   *
   *   Adjust `fb.group(...)` accordingly so the compiler infers the correct
   *   control types without any casts.
   *
   * Task B – Fix the edit-mode bug:
   *   When `mode === 'edit'` the form is built but never populated with the
   *   existing user's values, so the dialog always opens blank.
   *   Fix `ngOnInit` so that editing a user pre-fills every form control with
   *   the user's current data.
   */
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*$')]],
      role: ['viewer', Validators.required],
      department: ['Engineering', Validators.required],
      isActive: [true],
    });

    if (this.data.mode === 'edit' && this.data.user) {
      console.log('Edit mode for user:', this.data.user.id);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.dialogRef.close({
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        role: formValue.role,
        department: formValue.department,
        status: formValue.isActive ? 'active' : 'inactive',
      });
    }
  }
}
