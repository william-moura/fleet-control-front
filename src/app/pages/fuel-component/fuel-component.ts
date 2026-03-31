import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { firstValueFrom } from 'rxjs';
import { FuelSupplyService } from '../../services//fuel-supply-service';
import { FuelSupply } from '../../models/fuel-supply';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormAddFuelSupplier } from '../form-add-fuel-supplier/form-add-fuel-supplier';


@Component({
  selector: 'app-fuel-component',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, 
    MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, 
    MatNativeDateModule, MatButtonModule, MatIconModule, MatTooltipModule, MatProgressBarModule, MatCardModule, 
    MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './fuel-component.html',
  styleUrl: './fuel-component.scss',
})
export class FuelComponent implements OnInit{
  private fuelSupplyService = inject(FuelSupplyService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  isLoading = signal(false);
  displayedColumns: string[] = ['vehiclePlate', 'vehicleModel','fuelSupplyDate', 'fuelSupplyQuantity', 'fuelSupplyTotalValue', 'supplierFantasyName', 'acoes'];
  dataSource = new MatTableDataSource<FuelSupply>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  
  fuelSupplies = signal<FuelSupply[]>([]);
  ngOnInit() {
    // Cálculo Automático: Valor Total = Litros * Valor Unitário
    // this.form.valueChanges.subscribe(() => {
    //   const litros = this.form.get('litros')?.value || 0;
    //   const valorUnit = this.form.get('valorLitro')?.value || 0;
    //   const total = litros * valorUnit;
      
    //   this.form.get('valorTotal')?.setValue(total.toFixed(2), { emitEvent: false });
    // });
    this.getFuelSupplies();
  }

  salvar() {
    // if (this.form.valid) {
    //   // Enviamos o RawValue para incluir o campo 'valorTotal' que está disabled
    //   this.dialogRef.close(this.form.getRawValue());
    // }
  }
  abrirModalCadastro() {
    const dialogRef = this.dialog.open(FormAddFuelSupplier, {
      width: '500px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fuelSupplyService.createFuelSupply(result).subscribe({
          next: (fuelSupply) => {
            this.snackBar.open('Abastecimento cadastrado com sucesso', 'Fechar', { duration: 3000 });
            this.getFuelSupplies();
          },
          error: (error) => {
            console.error('Erro ao cadastrar abastecimento:', error);
            this.snackBar.open('Erro ao cadastrar abastecimento', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
    // this.dialog.open(FuelSupplyFormComponent, {
    //   width: '500px',
    // });
  }
  excluir(id: number) {
    // this.fuelSupplyService.deleteFuelSupply(id).subscribe({
    //   next: () => {
    //     this.snackBar.open('Abastecimento excluído com sucesso', 'Fechar', { duration: 3000 });
    //     this.getFuelSupplies();
    //   },
    // });
  }
  updateFuelSupply(fuelSupply: FuelSupply) {
    // this.dialog.open(VehicleFormComponent, {
    //   width: '500px',
    //   data: vehicle,
    // });
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getFuelSupplies() {
    this.isLoading.set(true);
    this.fuelSupplyService.getAllFuelSupplies().subscribe({
      next: (fuelSupplies) => {
        this.dataSource.data = fuelSupplies;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao buscar abastecimentos:', error);
        this.isLoading.set(false);
      }
    });
  }
}
