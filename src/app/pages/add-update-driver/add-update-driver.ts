import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

// Angular Material Imports
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskDirective } from 'ngx-mask';
import { UppercaseDirective } from '../../uppercase';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DriverService } from '../../services/driver-service';
import { Driver } from '../../models/driver';
import { CepService } from '../../services/cep-service';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { VehicleFineService } from '../../services/vehicle-fine-service';
import { VehicleFine } from '../../models/vehicle-fine';
import { ListDriverFine } from '../../components/list-driver-fine/list-driver-fine';
import { Photo } from '../../models/photo';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-update-driver',
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
    NgxMaskDirective,
    UppercaseDirective,
    ListDriverFine,
    MatProgressSpinnerModule],
  templateUrl: './add-update-driver.html',
  styleUrl: './add-update-driver.scss',
})
export class AddUpdateDriver {
  private fb = inject(FormBuilder);
  private driverService = inject(DriverService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private driver = signal<Driver | null>(null);
  update = signal<boolean>(false);
  private cepService = inject(CepService);
  form: FormGroup;
  loading = signal<boolean>(false);
  private driverStateService = inject(VehicleStateService);
  private vehicleFineService = inject(VehicleFineService);
  driverFines = signal<VehicleFine[]>([]);
  private routerSubscription: Subscription | undefined;
  constructor(private cdr: ChangeDetectorRef) {    
    this.form = this.fb.group({
      driverName: ['', Validators.required],
      driverRegisteredNumber: [{value: '', disabled: true}, Validators.required],
      driverAddress: ['', Validators.required],
      driverCity: ['', Validators.required],
      driverState: ['', Validators.required],
      driverZipCode: ['', Validators.required],
      driverBloodType: ['', Validators.required],
      driverRg: ['', [Validators.required, Validators.maxLength(9)]],
      driverCpf: ['', [Validators.required, this.validateCpf]],
      driverLicenseNumber: ['', Validators.required],
      driverLicenseExpirationDate: ['', [Validators.required, this.validateLicenseExpirationDate()]],
      driverLicenseCategory: ['', Validators.required],
      driverBirthDate: ['', [Validators.required, this.validateBirthDate()]],
      driverEmail: ['', [Validators.required, Validators.email]],
      driverPhone: ['', Validators.required],
      driverStatus: ['', Validators.required],
      driverPhoto: [''],
      driverNeighborhood: ['', Validators.required],
      photosIds: [[]],
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
  getCep(cep: string) {
    this.loading.set(true);
    this.cepService.getCep(cep).subscribe((cep) => {
      this.form.patchValue({
        driverAddress: cep.street,
        driverCity: cep.city,
        driverState: cep.state,        
        driverNeighborhood: cep.neighborhood,
      });
      this.loading.set(false);
    });
  }
  salvar() {
    if (this.form.get('driverName')?.errors?.['required']) {
      this.snackBar.open('Nome do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('driverBloodType')?.errors?.['required']) {
      this.snackBar.open('Tipo sanguíneo do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    
    }
    if (this.form.get('driverCpf')?.errors?.['required']) {
      this.snackBar.open('CPF do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('driverRg')?.errors?.['required']) {
      this.snackBar.open('RG do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.form.get('driverBirthDate')?.errors?.['required']) {
      this.snackBar.open('Data de nascimento do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('driverBirthDate')?.errors?.['invalidBirthDate']) {
      this.snackBar.open('Idade mínima para cadastro de motorista é 18 anos', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('driverPhone')?.errors?.['required']) {
      this.snackBar.open('Telefone do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.form.get('driverLicenseNumber')?.errors?.['required']) {
      this.snackBar.open('Número da CNH do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('driverLicenseCategory')?.errors?.['required']) {
      this.snackBar.open('Categoria da CNH do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('driverLicenseExpirationDate')?.errors?.['required']) {
      this.snackBar.open('Data de expiração da CNH do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('driverLicenseExpirationDate')?.errors?.['invalidLicenseExpirationDate']) {
      this.snackBar.open('Data de expiração da CNH deve ser maior que a data atual', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.form.get('driverZipCode')?.errors?.['required']) {
      this.snackBar.open('CEP do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    
    if (this.form.get('driverAddress')?.errors?.['required']) {
      this.snackBar.open('Endereço do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.form.get('driverNeighborhood')?.errors?.['required']) {
      this.snackBar.open('Bairro do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('driverCity')?.errors?.['required']) {
      this.snackBar.open('Cidade do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('driverState')?.errors?.['required']) {
      this.snackBar.open('Estado do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    
    if (this.form.get('driverStatus')?.errors?.['required']) {
      this.snackBar.open('Status do motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('driverEmail')?.errors?.['email']) {
      this.snackBar.open('Email do motorista é inválido', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.valid) {

      if (this.update()) {
        this.updateDriver();
      } else {
        this.createDriver();
      }
    }
  }
  cancelar() {
    this.clearForm();
    this.router.navigate(['/drivers']);
  }
  voltar() {
    this.clearForm();
    this.router.navigate(['/drivers']);
  }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.driverService.getDriverById(Number(id)).subscribe((driver) => {
        this.driver.set(driver);
        this.update.set(true);
        if (driver.driverLicenseExpirationDate) {
          const licenseExpirationDate = driver.driverLicenseExpirationDate as string;
          driver.driverLicenseExpirationDate = licenseExpirationDate.split('-').reverse().join('/');
        }
        if (driver.driverBirthDate) {
          const birthDate = driver.driverBirthDate as string;
          driver.driverBirthDate = birthDate.split('-').reverse().join('/');
        }
        this.form.patchValue(driver);
      });
    }
    this.routerSubscription = this.router.events.subscribe(event => {
      // Verifica se a navegação está começando e se foi acionada pelo botão voltar
      if (event instanceof NavigationStart && event.navigationTrigger === 'popstate') {
        this.clearForm();
      }
    })
    this.driver.set(this.driverStateService.selectedDriver());
    console.log(this.driver(), 'driver');
    if (this.driver()) {
      const driverId = this.driver()?.id;
      if (!driverId) {
        return;
      }
      this.update.set(true);
      this.vehicleFineService.getVehicleFinesByDriverId(driverId).subscribe((vehicleFines) => {
        this.driverFines.set(vehicleFines);
      });
      const dataForm = { ...this.driver() };
      if (dataForm.driverLicenseExpirationDate) {
        dataForm.driverLicenseExpirationDate = dataForm.driverLicenseExpirationDate.split('-').reverse().join('/');
      }
      if (dataForm.driverBirthDate) {
        dataForm.driverBirthDate = dataForm.driverBirthDate.split('-').reverse().join('/');
      }
      if (dataForm.photos) {
        dataForm.driverPhoto = dataForm.photos[0]?.path;
        dataForm.photosIds = dataForm.photos.map((photo: Photo) => photo.id);
      }
      this.form.patchValue({ ...dataForm });
    } else {
      this.update.set(false);
      this.driverService.getNextRegistrationNumber().subscribe((nextRegistrationNumber) => {
        this.form.patchValue({
          driverRegisteredNumber: nextRegistrationNumber,
        });
      });
    }
  }
  private clearForm() {
    this.form.patchValue({});
    this.driver.set(null);
    this.update.set(false);
    this.driverStateService.setDriver(null);
  }
  private createDriver() {
    const dataForm = { ...this.form.value };
    if (dataForm.driverLicenseExpirationDate) {
      dataForm.driverLicenseExpirationDate = dataForm.driverLicenseExpirationDate.split('/').reverse().join('-');
    }
    if (dataForm.driverBirthDate) {
      dataForm.driverBirthDate = dataForm.driverBirthDate.split('/').reverse().join('-');
    }
    this.driverService.createDriver(dataForm).subscribe({
      next: (driver) => {
      this.snackBar.open('Motorista cadastrado com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/drivers']);
      },
      error: (error) => {
        console.error('Erro ao cadastrar motorista:', error);
        this.snackBar.open('Erro ao cadastrar motorista', 'Fechar', { duration: 3000 });
      }
    });
  }
  private updateDriver() {
    const id = this.driver()?.id;
    if (!id) {
      return;
    }
    const dataForm = { ...this.form.value };
    if (dataForm.driverLicenseExpirationDate) {
      dataForm.driverLicenseExpirationDate = dataForm.driverLicenseExpirationDate.split('/').reverse().join('-');
    }
    if (dataForm.driverBirthDate) {
      dataForm.driverBirthDate = dataForm.driverBirthDate.split('/').reverse().join('-');
    }
    this.driverService.updateDriver(id, dataForm).subscribe({
      next: (driver) => {
        this.snackBar.open('Motorista atualizado com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/drivers']);
      },
      error: (error) => {
        console.error('Erro ao atualizar motorista:', error);
        this.snackBar.open('Erro ao atualizar motorista', 'Fechar', { duration: 3000 });
      }
    });
  }
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.processFiles(files[0]);
    }
  }
  processFiles(files: File) {
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (files.size > maxSize) {
      this.snackBar.open('Tamanho do arquivo muito grande', 'Fechar', { duration: 3000 });
      return;
    }
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(files.type)) {
      this.snackBar.open('Formato de arquivo inválido', 'Fechar', { duration: 3000 });
      return;
    }
    const reader = new FileReader();

    reader.readAsDataURL(files);
    const formData = new FormData();
    formData.append('file', files);
    this.driverService.uploadPhotos(formData).subscribe((photo) => {
      this.form.patchValue({
        driverPhoto: photo.path,
        photosIds: [photo.id],
      });
      this.cdr.detectChanges();
    });
  }
  deletePhoto() {
    this.form.patchValue({
      driverPhoto: '',
      photosIds: [],
    });
    this.cdr.detectChanges();
  }
  private validateBirthDate() {
    return (control: AbstractControl) => {
      const birthDate = control.value;
      const today = new Date();
      const birthDateDate = new Date(birthDate);
      //return birthDateDate < today ? null : { invalidBirthDate: true };

      const hoje = new Date();
  
      let idade = hoje.getFullYear() - birthDateDate.getFullYear();
      const mesAtual = hoje.getMonth();
      const mesNascimento = birthDateDate.getMonth();
    
      // Se ainda não chegou o mês do aniversário, ou se é o mês mas não chegou o dia, subtrai 1 ano
      if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < birthDateDate.getDate())) {
        idade--;
      }
      if (idade < 18) {
        //this.snackBar.open('Idade mínima para cadastro de motorista é 18 anos', 'Fechar', { duration: 3000 });
        return { invalidBirthDate: true };
      }
      return null;
    }
  }

  validateBirthDateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const date = new Date(value);
    const birthDateDate = new Date(date);
    const hoje = new Date();
    let idade = hoje.getFullYear() - birthDateDate.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = birthDateDate.getMonth();
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < birthDateDate.getDate())) {
      idade--;
    }
    if (idade < 18) {
      console.log('Idade mínima para cadastro de motorista é 18 anos');
      this.snackBar.open('Idade mínima para cadastro de motorista é 18 anos', 'Fechar', { duration: 3000 });
      return false;
    }
    return null;
  }

  private validateLicenseExpirationDate() {
    return (control: AbstractControl) => {
      const licenseExpirationDate = control.value;
      const today = new Date();
      const licenseExpirationDateDate = new Date(licenseExpirationDate);
      if (licenseExpirationDateDate.getFullYear() < today.getFullYear() || (licenseExpirationDateDate.getFullYear() === today.getFullYear() && licenseExpirationDateDate.getMonth() < today.getMonth()) || (licenseExpirationDateDate.getFullYear() === today.getFullYear() && licenseExpirationDateDate.getMonth() === today.getMonth() && licenseExpirationDateDate.getDate() < today.getDate() )) {

        return { invalidLicenseExpirationDate: true };
      }
      return null;
    }
  }

  validateLicenseExpirationDateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const date = new Date(value);
    const licenseExpirationDateDate = new Date(date);
    const hoje = new Date();
    if (licenseExpirationDateDate.getFullYear() < hoje.getFullYear() || (licenseExpirationDateDate.getFullYear() === hoje.getFullYear() && licenseExpirationDateDate.getMonth() < hoje.getMonth()) || (licenseExpirationDateDate.getFullYear() === hoje.getFullYear() && licenseExpirationDateDate.getMonth() === hoje.getMonth() && licenseExpirationDateDate.getDate() < hoje.getDate() )) {     
      this.snackBar.open('Data de expiração da CNH deve ser maior que a data atual', 'Fechar', { duration: 3000 });
      return false;
    }
    return null;
  }
}
