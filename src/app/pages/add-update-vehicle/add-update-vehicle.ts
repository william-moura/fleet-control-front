import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../../models/vehicle';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { VehicleHistory } from '../../models/vehicle-history';
import { VehicleService } from '../../services/vehicle-service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Maintenance } from '../../models/maintenance';
import { FuelSupply } from '../../models/fuel-supply';
import { MaintenanceService } from '../../services/maintenance-service';
import { FuelSupplyService } from '../../services/fuel-supply-service';
import { ListFuelSuppliers } from '../../components/list-fuel-suppliers/list-fuel-suppliers';
import { ListMaintenance } from '../../components/list-maintenance/list-maintenance';
import { Brand } from '../../models/brand';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuelType } from '../../models/fuel-type';
import { NgxMaskDirective } from 'ngx-mask';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { MY_DATE_FORMATS, MY_LUXON_FORMATS } from '../../app.config';
import { Photo } from '../../models/photo';
import { DragDropDirective } from '../../drag-drop-directive';
import { AsyncSelect } from '../../components/async-select/async-select';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { FormAddBrand } from '../../forms/form-add-brand/form-add-brand';
import { MatDialog } from '@angular/material/dialog';
import { SyncDriver } from '../../components/sync-driver/sync-driver';
import { Driver } from '../../models/driver';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { DriverService } from '../../services/driver-service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-update-vehicle',
  imports: [
    CommonModule,
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
    MatDividerModule,
    MatListModule,
    MatProgressBarModule,    
    ListFuelSuppliers,
    ListMaintenance,
    MatProgressSpinnerModule,
    NgxMaskDirective,
    DragDropDirective,
    AsyncSelect,
    SyncDriver
  ],
  providers:[
  ],
  templateUrl: './add-update-vehicle.html',
  styleUrl: './add-update-vehicle.scss',
})
export class AddUpdateVehicle {
  private title = inject(Title);
  veiculoForm: FormGroup;
  veiculoDados: Vehicle | null = null;
  //veiculoDadoss = input<Vehicle | null>(null);
  update = signal<boolean>(false);  
  private router = inject(Router);
  private vehicleStateService = inject(VehicleStateService);
  isLoading = signal<boolean>(true);
  historico = signal<VehicleHistory[]>([]);
  private vehicleService = inject(VehicleService);
  maintenances = signal<Maintenance[]>([]);
  fuelSupplies = signal<FuelSupply[]>([]);
  private maintenanceService = inject(MaintenanceService);
  private fuelSupplyService = inject(FuelSupplyService);
  brands = signal<Brand[]>([]);  
  private snackBar = inject(MatSnackBar);
  fuelTypes = signal<FuelType[]>([]);
  previews:Photo[] = [];
  selectedFiles:File[] = [];
  photosIds:number[] = [];
  selectedPhoto:Photo | null = null;
  private route = inject(ActivatedRoute);
  brands$ = signal<Observable<Brand[]>>(of([]));
  private dialog = inject(MatDialog);
  drivers = signal<Driver[]>([]);
  drivers$ = signal<Observable<Driver[]>>(of([]));
  private driverService = inject(DriverService);
  driverForm: FormGroup;
  //driverId = input<number | null>(null);
  isAba2Active = true;
  ngOnInit() {
    this.getBrands();
    this.title.setTitle('Adicionar Veículo');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.title.setTitle('Editar Veículo');
      this.getVehicleById(Number(id));
    }
    const veiculoDadoss = this.veiculoDados;
    this.vehicleService.getBrands().subscribe((brands) => {
      this.brands.set(brands);
    });
    this.vehicleService.getFuelTypes().subscribe((fuelTypes) => {
      this.fuelTypes.set(fuelTypes);
    });
    if (veiculoDadoss) {
      this.update.set(true);
      if (veiculoDadoss.vehiclePurchaseDate) {
        const purchaseDate = veiculoDadoss.vehiclePurchaseDate as string;
        veiculoDadoss.vehiclePurchaseDate = purchaseDate.split('-').reverse().join('/');
      }
      this.previews = veiculoDadoss.photos.map((photo: Photo) => photo);
      this.photosIds = veiculoDadoss.photos.map((photo: Photo) => photo.id);
      this.selectedPhoto = veiculoDadoss.photos[0];
      this.veiculoDados = veiculoDadoss;
      this.veiculoForm.patchValue(veiculoDadoss);


    } else {
      this.update.set(false);
      this.isLoading.set(false);
    }
  }

  constructor(private fb: FormBuilder) {
    const currentYear = new Date().getFullYear() +1;
    console.log(currentYear, 'currentYear');
    this.veiculoForm = this.fb.group({
      vehiclePlate: ['', Validators.required],
      vehicleStatus: ['', Validators.required],
      brandId: ['', Validators.required],
      vehicleModel: ['', [Validators.required]],
      vehicleYear: ['', [Validators.required, Validators.max(new Date().getFullYear())]],
      fuelTypeId: ['', Validators.required],
      vehicleCurrentMileage: ['', [Validators.required, Validators.maxLength(7)]],
      vehiclePurchaseDate: ['', [Validators.required, this.validatePurchaseDate()]],
      vehicleNotes: [''],
      vehicleTankCapacity: ['', [Validators.required, Validators.maxLength(3)]],
      vehicleTransmissionType: ['', Validators.required],
      vehicleColor: ['', Validators.required],
      vehicleModelYear: ['', [Validators.required, Validators.max(currentYear)]],
      vehicleRenavamNumber: ['', Validators.required],
      vehicleChassisNumber: ['', Validators.required],      
    });
    this.driverForm = this.fb.group({
      driverId: ['', Validators.required],
    });
  }

  salvar() {
    if (this.veiculoForm.get('vehiclePlate')?.errors?.['required']) {
      this.snackBar.open('Placa do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.veiculoForm.get('vehicleStatus')?.errors?.['required']) {
      this.snackBar.open('Status do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.veiculoForm.get('brandId')?.errors?.['required']) {
      this.snackBar.open('Marca do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.veiculoForm.get('vehicleModel')?.errors?.['required']) {
      this.snackBar.open('Modelo do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.veiculoForm.get('vehicleYear')?.errors?.['max']) {
      this.snackBar.open('Ano do veículo não deve ser maior que o ano atual', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.veiculoForm.get('vehicleYear')?.errors?.['required']) {
      this.snackBar.open('Ano do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.veiculoForm.get('vehicleModelYear')?.errors?.['required']) {
      this.snackBar.open('Ano do modelo do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.veiculoForm.get('vehicleModelYear')?.errors?.['max']) {
      this.snackBar.open('Ano do modelo do veículo não deve ser maior que o ano atual + 1', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.veiculoForm.get('fuelTypeId')?.errors?.['required']) {
      this.snackBar.open('Tipo de combustível do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.veiculoForm.get('vehicleTransmissionType')?.errors?.['required']) {
      this.snackBar.open('Tipo de transmissão do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.veiculoForm.get('vehicleRenavamNumber')?.errors?.['required']) {
      this.snackBar.open('Número do Renavam do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.veiculoForm.get('vehicleChassisNumber')?.errors?.['required']) {
      this.snackBar.open('Número do chassi do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }


    if (this.veiculoForm.get('vehicleColor')?.errors?.['required']) {
      this.snackBar.open('Cor do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.veiculoForm.get('vehicleTankCapacity')?.errors?.['required']) {
      this.snackBar.open('Capacidade de combustível do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

   
    if (this.veiculoForm.get('vehicleCurrentMileage')?.errors?.['required']) {
      this.snackBar.open('Quilometragem atual do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.veiculoForm.get('vehiclePurchaseDate')?.errors?.['required']) {
      this.snackBar.open('Data de aquisição do veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.veiculoForm.get('vehiclePurchaseDate')?.errors?.['invalidPurchaseDate']) {
      this.snackBar.open('Data de aquisição do veículo deve ser menor que a data atual', 'Fechar', { duration: 3000 });
      return;
    }


 
    if (this.veiculoForm.valid) {
      this.isLoading.set(true);      
      this.veiculoForm.value.vehicleStatus = this.veiculoForm.value.vehicleStatus == 'ativo' ? '1' : '2';
      this.veiculoForm.value.vehiclePurchaseDate = this.veiculoForm.value.vehiclePurchaseDate.split('/').reverse().join('-');
      this.veiculoForm.value.photosIds = this.photosIds;
      if (this.update()) {
        this.updateVehicle();
      } else {
        this.createVehicle();
      }
    }
  }

  cancelar() {
    this.clearForm();
    this.router.navigate(['/vehicles']);
  }

  voltar() {
    this.clearForm();
    this.router.navigate(['/vehicles']);
  }

  private updateVehicle() {
    const id = this.veiculoDados?.id;
    if (!id) {
      return;
    }
    this.isLoading.set(true);
    this.vehicleService.updateVehicle(id, this.veiculoForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open('Veículo atualizado com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/vehicles']);
      },
      error: (error) => {
        console.error('Erro ao atualizar veículo:', error);
        this.isLoading.set(false);
        this.snackBar.open('Erro ao atualizar veículo ' + error.message, 'Fechar', { duration: 3000 });
      }
    });
  }

  private createVehicle() {    
    this.vehicleService.createVehicle(this.veiculoForm.value).subscribe({
      next: (vehicle: Vehicle) => {
        this.isLoading.set(false);
        this.snackBar.open('Veículo cadastrado com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/vehicles']);
      },
      error: (error) => {
        console.error('Erro ao cadastrar veículo:', error);
        this.isLoading.set(false);
        this.snackBar.open('Erro ao cadastrar veículo ' + error.message, 'Fechar', { duration: 3000 });
      }
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.processFiles(files);
    }
  }
  onFileDropped(file: File) {
    this.processFiles([file]);
  }
  processFiles(files: File[]) {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (files[i].size > maxSize) {
        this.snackBar.open('Tamanho do arquivo muito grande', 'Fechar', { duration: 3000 });
        return;
      }
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(files[i].type)) {
        this.snackBar.open('Formato de arquivo inválido', 'Fechar', { duration: 3000 });
        return;
      }
      reader.onload = (e: any) => {
        //this.previews.push(e.target.result); // URL para o [src] da img
        this.selectedFiles.push(files[i]);   // Arquivo real para o backend
      };

      reader.readAsDataURL(files[i]);
      const formData = new FormData();
      formData.append('file', files[i]);
      this.vehicleService.uploadPhotos(formData).subscribe((photo) => {
        this.photosIds.push(photo.id);
        this.previews.push(photo);
        console.log(this.previews);
      });
    }
  }
  removePhoto(photo: Photo) {
    this.previews = this.previews.filter((p) => p.id !== photo.id);
    this.photosIds = this.photosIds.filter((id) => id !== photo.id);
    this.vehicleService.deletePhoto(photo.id).subscribe((response) => {
      console.log(response);
    });
    console.log(this.previews);
  }
  private clearForm() {
    this.selectedPhoto = null;
    this.previews = [];
    this.photosIds = [];
    this.veiculoForm.patchValue({});
    this.veiculoDados = null;
    this.update.set(false);
    this.isLoading.set(false);
    this.vehicleStateService.setVehicle(null);
  }  
  private validatePurchaseDate() {
    return (control: AbstractControl) => {
      const purchaseDate = control.value;
      const purchaseDateDate = new Date(purchaseDate);
      const today = new Date();
      if (purchaseDateDate.getFullYear() > today.getFullYear() || (purchaseDateDate.getFullYear() === today.getFullYear() && purchaseDateDate.getMonth() > today.getMonth()) || (purchaseDateDate.getFullYear() === today.getFullYear() && purchaseDateDate.getMonth() === today.getMonth() && purchaseDateDate.getDate() > today.getDate() )) {
        return { invalidPurchaseDate: true };
      }
      return null;
    };
  }

  validatePurchaseDateInput(purchaseDate: string) {
    const purchaseDateDate = new Date(purchaseDate);
    const today = new Date();
    if (purchaseDateDate.getFullYear() > today.getFullYear() || (purchaseDateDate.getFullYear() === today.getFullYear() && purchaseDateDate.getMonth() > today.getMonth()) || (purchaseDateDate.getFullYear() === today.getFullYear() && purchaseDateDate.getMonth() === today.getMonth() && purchaseDateDate.getDate() > today.getDate() )) {
      this.snackBar.open('Data de aquisição deve ser menor que a data atual', 'Fechar', { duration: 3000 });
      return false;
    }
    return true;
  }
  async getBrands() {
    this.brands$.set(this.vehicleService.getBrands().pipe(map((brands) => brands as Brand[])));
  }
  async addBrand() {
    const dialogRef = this.dialog.open(FormAddBrand, {
      width: '600px',
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      try {
        this.isLoading.set(true);
        await firstValueFrom(this.vehicleService.createBrand(result));
        this.snackBar.open('Marca cadastrada com sucesso', 'Fechar', { duration: 3000 });      
      } catch (error) {
        console.error('Erro ao cadastrar marca:', error);
        this.snackBar.open('Erro ao cadastrar marca', 'Fechar', { duration: 3000 });
      } finally {
        this.isLoading.set(false);        
      }
    }
  }
  async deleteDriver(driver: Driver) {
    this.vehicleService.removeSyncDriver(Number(this.veiculoDados?.id), driver.id).subscribe({
      next: () => {
        this.snackBar.open('Motorista removido com sucesso', 'Fechar', { duration: 3000 });
        this.getVehicleById(Number(this.veiculoDados?.id));
      },
      error: (error) => {
        console.error('Erro ao remover motorista:', error);
        this.snackBar.open('Erro ao remover motorista', 'Fechar', { duration: 3000 });
      }
    });
  }
  async getDrivers() {
    const idsDrivers = this.drivers().map((driver) => driver.id);
    const drivers = await firstValueFrom(this.driverService.getAllDrivers(0, 1000));
    const driversData = drivers.data.filter((driver) => !idsDrivers.includes(driver.id));
    this.drivers$.set(of(driversData as Driver[]));
  }
  async associateDrivers() {
    const driverId = this.driverForm.value.driverId;
    if (!driverId) {
      this.snackBar.open('Motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    const vehicleId = this.veiculoDados?.id;
    if (!vehicleId) {
      return;
    }
    try {
      this.isLoading.set(true);
      await firstValueFrom(this.vehicleService.addSyncDriver(Number(vehicleId), driverId));
      this.snackBar.open('Motorista associado com sucesso', 'Fechar', { duration: 3000 });
      this.getVehicleById(vehicleId);
      this.veiculoForm.patchValue({ driverId: null });
    } catch (error) {
      console.error('Erro ao associar motorista:', error);
      this.snackBar.open('Erro ao associar motorista', 'Fechar', { duration: 3000 });
    }
    finally {
      this.isLoading.set(false);
    }
  }

  private getVehicleById(id: number) {
    this.vehicleService.getVehicleById(Number(id)).subscribe((vehicle) => {
      this.veiculoDados = vehicle;
      this.update.set(true);
      if (vehicle.vehiclePurchaseDate) {
        const purchaseDate = vehicle.vehiclePurchaseDate as string;
        vehicle.vehiclePurchaseDate = purchaseDate.split('-').reverse().join('/');
      }
      this.previews = vehicle.photos.map((photo: Photo) => photo);
      this.photosIds = vehicle.photos.map((photo: Photo) => photo.id);
      this.selectedPhoto = vehicle.photos[0];
      this.veiculoForm.patchValue(vehicle);
      this.fuelSupplies.set(vehicle.fuelSuppliers || []);
      this.maintenances.set(vehicle.maintenances || []);
      this.isLoading.set(false);
      this.fuelSupplies.set(vehicle.fuelSuppliers || []);
      this.vehicleService.getVehicleHistory(this.veiculoDados?.id).subscribe({
        next: (history: VehicleHistory[]) => {
          this.historico.set(history);
        },
        error: (error) => {
          console.error('Erro ao buscar histórico do veículo:', error);
          this.snackBar.open('Erro ao buscar histórico do veículo ' + error.message, 'Fechar', { duration: 3000 });
          this.isLoading.set(false);
        }
      });
      this.drivers.set(vehicle.drivers || []);      
    });
  }

  tabChanged(event: MatTabChangeEvent): void {
    // A propriedade 'index' começa em 0. Aba 2 é o índice 1
    this.isAba2Active = event.index === 0;
  }
}
