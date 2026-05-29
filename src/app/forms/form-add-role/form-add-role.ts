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
import { RolesServices } from '../../services/roles-services';

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
  constructor(private rolesService: RolesServices) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      permissions: ['', Validators.required],
    });
    this.rolesService.getPermissions().subscribe((permissions) => {
      this.permissions.set(permissions);
    });
  }
  ngOnInit() {
    if (this.data) {
      const dataForm = {
        id: this.data.id,
        name: this.data.name,
        permissions: this.data.permissions.map((permission: Permission) => permission.id),
      };
      console.log(dataForm,'dataForm');
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
  getFirstSelectedPermissionName(): string {
    const idsSelecionados = this.form.get('permissions')?.value;
    if (!idsSelecionados || idsSelecionados.length === 0) return '';
    
    // Encontra o objeto completo na lista original usando o primeiro ID
    const primeiraPermissao = this.permissions().find(p => p.id === idsSelecionados[0]);
    return primeiraPermissao ? primeiraPermissao.name : '';
  }
}
