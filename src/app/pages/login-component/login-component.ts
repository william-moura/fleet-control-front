import { Component, signal, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Correct import path
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, 
    MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  isLoading = signal(false);
  errorMessage = signal('');
  loginForm: FormGroup;
  hidePassword = true;
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required, this.validateCpf]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading.set(false);          
          this.ngZone.run(() => {            
            this.router.navigate(['welcome']); 
          });
        },
        error: (err: Error) => {
          this.snackBar.open('Usuário ou senha inválidos.', 'Fechar', { duration: 3000 });          
          alert('Usuário ou senha inválidos.');
        }
      });
    }
  }
  private validateCpf(control: AbstractControl) {
    const texto = control.value;
    if (texto.includes('@')) {
      return null;
    }
    const cpf = texto.replace(/[^\d]+/g, '');;

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
