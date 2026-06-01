import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-esqueci-senha',
  imports: [],
  templateUrl: './esqueci-senha.html',
  styleUrl: './esqueci-senha.scss',
})
export class EsqueciSenha {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.authService.esqueciSenha(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.errorMessage.set('Nova senha enviada para o e-mail');
        },
      });
    }
  }
}
