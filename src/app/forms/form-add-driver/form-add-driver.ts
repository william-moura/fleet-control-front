import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../app.config';
import { DriverService } from '../../services/driver-service';
import { NgxMaskDirective } from 'ngx-mask';
import { UppercaseDirective } from '../../uppercase';
import { CepService } from '../../services/cep-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter'; // <-- MUDOU AQUI

export const MY_LUXON_FORMATS = {
  parse: {
    dateInput: 'dd/MM/yyyy', // Força o Luxon a ler estritamente como Dia/Mês/Ano
  },
  display: {
    dateInput: 'dd/MM/yyyy', // Como exibe no input
    monthYearLabel: 'LLL yyyy',
    dateA11yLabel: 'DD',
    monthYearA11yLabel: 'LLL yyyy',
  },
};

@Component({
  selector: 'app-form-add-driver',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
   UppercaseDirective, NgxMaskDirective],
  providers:[
  ],
  templateUrl: './form-add-driver.html',
  styleUrl: './form-add-driver.scss',
})
export class FormAddDriver {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormAddDriver>);
  private driverService = inject(DriverService);
  private cepService = inject(CepService);
  private snackBar = inject(MatSnackBar);
  public data = inject(MAT_DIALOG_DATA);
  form: FormGroup;
  constructor() {
    this.form = this.fb.group({
      driverName: ['', Validators.required],
      driverRegisteredNumber: ['', Validators.required],
      driverAddress: ['', Validators.required],
      driverCity: ['', Validators.required],
      driverState: ['', Validators.required],
      driverZipCode: ['', Validators.required],
      driverBloodType: ['', Validators.required],
      driverRg: ['', Validators.required],
      driverCpf: ['', [Validators.required, this.validateCpf]],
      driverLicenseNumber: ['', Validators.required],
      driverLicenseExpirationDate: ['', Validators.required],
      driverLicenseCategory: ['', Validators.required],
      driverBirthDate: ['', Validators.required],
      driverPhone: ['', Validators.required],
      driverStatus: ['', Validators.required],
    });
  }
  ngOnInit() {
    if (this.data) {
      if (this.data.driverBirthDate) {
        this.data.driverBirthDate = this.data.driverBirthDate.split('-').reverse().join('/');
      }
      if (this.data.driverLicenseExpirationDate) {
        this.data.driverLicenseExpirationDate = this.data.driverLicenseExpirationDate.split('-').reverse().join('/');
      }
      const dataForm = { ...this.data };
      this.form.patchValue(dataForm);
    }
  }
  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }

  }
  onCancel() {
    this.dialogRef.close();
  }
  private validateCpf(control: AbstractControl) {
    const cpf = control.value;
    if (cpf.length !== 11) {
      return { invalidCpf: true };
    }
    return null;
  }
  getCep(cep: string) {
    this.cepService.getCep(cep).subscribe((cep) => {
      this.form.patchValue({
        driverAddress: cep.street,
        driverCity: cep.city,
        driverState: cep.state,        
        driverNeighborhood: cep.neighborhood,
      });
    });
  }
}
