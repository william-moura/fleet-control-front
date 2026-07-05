import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskDirective } from 'ngx-mask';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserService } from '../../services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolesServices } from '../../services/roles-services';
import { Role } from '../../models/role';
import { User } from '../../models/user';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-update-users',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskDirective
   ],
  templateUrl: './add-update-users.html',
  styleUrl: './add-update-users.scss',
})
export class AddUpdateUsers {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  form: FormGroup;
  update = signal<boolean>(false);
  private rolesService = inject(RolesServices);
  roles = signal<Role[]>([]);
  user = signal<User | null>(null);
  private userStateService = inject(VehicleStateService);
  private router = inject(Router);
  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['' ],
      confirmPassword: [''],
      role_id: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.maxLength(14), this.validateCpf]],
    }, {
      validator: this.confirmPasswordValidator,
    });
    this.rolesService.getRoles(0, 1000).subscribe((roles) => {
      this.roles.set(roles.data);
    });
  }
  ngOnInit() {
    this.user.set(this.userStateService.selectedUser());
    if (this.user()) {
      this.update.set(true);
      const dataForm = { ...this.user() };
      this.form.patchValue(dataForm);
    } else {
      this.update.set(false);
    }
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
  cancelar() {
    this.userStateService.setUser(null);
    this.router.navigate(['/users']);
  }
  salvar() {
    if (!this.form.valid) {
      return;
    }
    if (this.update()) {
      this.updateUser();
    }
    else {
      this.createUser();
    }
  }
  private createUser() {
    if (!this.form.valid) {
      return;
    }
    const dataForm = { ...this.form.value };
    this.userService.createUser(dataForm).subscribe({
      next: (user) => {
        this.user.set(user);
        this.snackBar.open('Usuário cadastrado com sucesso', 'Fechar', { duration: 3000 });
        this.router.navigate(['/users']);
      },
      error: (error) => {
        console.error('Erro ao cadastrar usuário:', error);
        this.snackBar.open('Erro ao cadastrar usuário', 'Fechar', { duration: 3000 });
      }
    });
  }
  private updateUser() {
    if (!this.form.valid) {
      return;
    }
    const id = this.user()?.id;
    if (!id) {
      return;
    }
    const dataForm = { ...this.form.value };
    this.userService.updateUser(id, dataForm).subscribe({
      next: (user) => {
        this.user.set(user);
        this.snackBar.open('Usuário atualizado com sucesso', 'Fechar', { duration: 3000 });
        this.router.navigate(['/users']);
      },
      error: (error) => {
        console.error('Erro ao atualizar usuário:', error);
        this.snackBar.open('Erro ao atualizar usuário', 'Fechar', { duration: 3000 });
      }
    });
  }
  private validateCpf(control: AbstractControl) {
    const cpf = control.value.replace(/[^\d]+/g, '');;

    // Remove caracteres não numéricos
    // CPF deve ter 11 dígitos
    if (cpf.length !== 11) return { invalidCpf: true };
  
    // Descarta sequências inválidas conhecidas
    if (/^(\d)\1{10}$/.test(cpf)) return { invalidCpf: true };
  
    // Validação do 1º dígito
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
  
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return { invalidCpf: true };
  
    // Validação do 2º dígito
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
  
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return { invalidCpf: true };
    
    return null;
  }
}
