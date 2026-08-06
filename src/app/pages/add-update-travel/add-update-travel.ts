import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Travel } from '../../models/travel';

@Component({
  selector: 'app-add-update-travel',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-update-travel.html',
  styleUrl: './add-update-travel.scss',
})
export class AddUpdateTravel {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  update = signal(false);
  loading = signal(false);
  travel = signal<Travel | null>(null);

  statusOptions = ['Agendada', 'Em andamento', 'Concluída', 'Cancelada'];

  constructor() {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      vehicle: ['', Validators.required],
      driver: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
      returnDate: [null],
      status: ['Agendada', Validators.required],
    });
  }

  ngOnInit() {
    this.update.set(false);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.update.set(true);
      this.form.patchValue({ id });
      // Integração com API de viagens pendente
    }
  }

  cancelar() {
    this.router.navigate(['/travels']);
  }

  salvar() {
    if (this.form.get('vehicle')?.errors?.['required']) {
      this.snackBar.open('Veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('driver')?.errors?.['required']) {
      this.snackBar.open('Motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('origin')?.errors?.['required']) {
      this.snackBar.open('Origem é obrigatória', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('destination')?.errors?.['required']) {
      this.snackBar.open('Destino é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('departureDate')?.errors?.['required']) {
      this.snackBar.open('Data de saída é obrigatória', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('status')?.errors?.['required']) {
      this.snackBar.open('Status é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.update()) {
      this.snackBar.open('Viagem atualizada com sucesso', 'Fechar', { duration: 3000 });
    } else {
      this.snackBar.open('Viagem criada com sucesso', 'Fechar', { duration: 3000 });
    }
    this.router.navigate(['/travels']);
  }
}
