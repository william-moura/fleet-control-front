import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
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
    DragDropDirective
  ],
  providers:[
  ],
  templateUrl: './add-update-vehicle.html',
  styleUrl: './add-update-vehicle.scss',
})
export class AddUpdateVehicle {
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
  ngOnInit() {
    const veiculoDadoss = this.vehicleStateService.selectedVehicle();    
    this.vehicleService.getBrands().subscribe((brands) => {
      this.brands.set(brands);
    });
    this.vehicleService.getFuelTypes().subscribe((fuelTypes) => {
      this.fuelTypes.set(fuelTypes);
    });
    console.log(veiculoDadoss, 'veiculoDadoss');
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
      this.vehicleService.getVehicleHistory(this.veiculoDados?.id).subscribe({
        next: (history: VehicleHistory[]) => {
          this.historico.set(history);
        },
        error: (error) => {
          console.error('Erro ao buscar histórico do veículo:', error);
          this.isLoading.set(false);
        }
      });
      this.maintenanceService.getMaintenancesByVehicleId(this.veiculoDados?.id).subscribe({
        next: (maintenances: Maintenance[]) => {
          this.maintenances.set(maintenances);          
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Erro ao buscar manutenções do veículo:', error);
          this.isLoading.set(false);
        }
      });
      this.fuelSupplyService.getFuelSuppliesByVehicleId(this.veiculoDados?.id).subscribe({
        next: (fuelSupplies: FuelSupply[]) => {
          this.fuelSupplies.set(fuelSupplies);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Erro ao buscar abastecimentos do veículo:', error);
          this.isLoading.set(false);
        }
      });
    } else {
      this.update.set(false);
      this.isLoading.set(false);
    }
  }

  constructor(private fb: FormBuilder) {
    this.veiculoForm = this.fb.group({
      vehiclePlate: ['', Validators.required],
      vehicleStatus: ['', Validators.required],
      brandId: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      vehicleYear: ['', Validators.required],
      fuelTypeId: ['', Validators.required],
      vehicleCurrentMileage: ['', [Validators.required, Validators.maxLength(7)]],
      vehiclePurchaseDate: ['', Validators.required],
      vehicleNotes: [''],
      vehicleTankCapacity: ['', [Validators.required, Validators.maxLength(3)]],
      vehicleTransmissionType: ['', Validators.required],
      vehicleColor: ['', Validators.required],
      vehicleModelYear: ['', Validators.required],
      vehicleRenavamNumber: ['', Validators.required],
      vehicleChassisNumber: ['', Validators.required],
    });
  }

  salvar() {
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
        this.snackBar.open('Erro ao atualizar veículo', 'Fechar', { duration: 3000 });
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
        this.snackBar.open('Erro ao cadastrar veículo', 'Fechar', { duration: 3000 });
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
}
