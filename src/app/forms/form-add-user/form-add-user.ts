import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';
import { Role } from '../../models/role';
import { Vehicle } from '../../models/vehicle';
import { RolesServices } from '../../services/roles-services';

@Component({
  selector: 'app-form-add-user',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './form-add-user.html',
  styleUrl: './form-add-user.scss',
})
export class FormAddUser {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormAddUser>);
  public data = inject(MAT_DIALOG_DATA);
  private rolesService = inject(RolesServices);
  form: FormGroup;
  roles = signal<Role[]>([]);
  update = signal(false);
  constructor(private authService: AuthService, private userService: UserService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', this.isPasswordRequired() ? Validators.required : ''],
      confirmPassword: ['', this.isPasswordRequired() ? Validators.required : ''],
      role_id: ['', Validators.required],
    }, {
      validator: this.confirmPasswordValidator,
    });
    this.rolesService.getRoles(0, 1000).subscribe((roles) => {
      this.roles.set(roles.data);
    });
  }
  ngOnInit() {
    if (this.data) {
      const dataForm = {
        id: this.data.id,
        name: this.data.name,
        email: this.data.email,
        role_id: this.data.role.id,
      };
      this.update.set(true);
      this.form.patchValue(dataForm);
    } else {
      this.update.set(false);
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
  confirmPasswordValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }
  isPasswordRequired(): boolean {
    return !this.update();
  }
}
