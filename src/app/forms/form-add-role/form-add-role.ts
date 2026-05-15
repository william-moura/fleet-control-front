import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UserService } from '../../services/user-service';
import { Permission } from '../../models/permission';

@Component({
  selector: 'app-form-add-role',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, 
    MatDatepickerModule, MatNativeDateModule],
  templateUrl: './form-add-role.html',
  styleUrl: './form-add-role.scss',
})
export class FormAddRole {  
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<FormAddRole>);
  public data = inject(MAT_DIALOG_DATA);
  form: FormGroup;
  private fb = inject(FormBuilder);
  permissions = signal<Permission[]>([]);
  constructor() {
    this.form = this.fb.group({
      role: ['', Validators.required],
      permissions: ['', Validators.required],
    });
    this.userService.getPermissions().subscribe((permissions) => {
      this.permissions.set(permissions);
    });
  }
  ngOnInit() {
    if (this.data) {
      const dataForm = { ...this.data };
      this.form.patchValue(dataForm);
    }
  }
  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
}
