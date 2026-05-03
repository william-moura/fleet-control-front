import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CurrencyPipe } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VehicleHistory } from '../../models/vehicle-history';
import { VehicleService } from '../../services/vehicle-service';

@Component({
  selector: 'app-vehicle-history-component',
  imports: [CommonModule, MatListModule, MatIconModule, MatDividerModule, 
    MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, CurrencyPipe],
  templateUrl: './vehicle-history-component.html',
  styleUrl: './vehicle-history-component.scss',
})
export class VehicleHistoryComponent {
  historico = signal<VehicleHistory[]>([]);
  data = inject(MAT_DIALOG_DATA);
  private vehicleService = inject(VehicleService);
  ngOnInit() {
    console.log(this.data, 'data');
    //this.historico.set([
    //  { id: 1, tipo: 'Abastecimento', data: new Date(), descricao: 'Abastecimento de 100 litros', valor: 100 },
    //  { id: 2, tipo: 'Manutenção', data: new Date(), descricao: 'Manutenção preventiva', valor: 200 },
    //  { id: 3, tipo: 'Reparo', data: new Date(), descricao: 'Reparo de 1000 reais', valor: 1000 },
    //]);
    this.vehicleService.getVehicleHistory(this.data.id).subscribe((history: VehicleHistory[]) => {
      this.historico.set(history);
    });
  }
}
