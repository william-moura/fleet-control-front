import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverService } from '../../services/driver-service';
import { Driver } from '../../models/driver';
@Component({
  selector: 'app-sync-driver-component',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './sync-driver-component.html',
  styleUrl: './sync-driver-component.scss',
  standalone: true,
})
export class SyncDriverComponent implements OnInit{
  private driverService = inject(DriverService);
  private dialogRef = inject(MatDialogRef<SyncDriverComponent>);
  public data = inject(MAT_DIALOG_DATA);

  drivers = signal<Driver[]>([]);
  selectedDriverIds: number[] = [];
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.getDrivers();
    if (this.data.drivers && Array.isArray(this.data.drivers)) {
      this.selectedDriverIds = this.data.drivers.map((driver: Driver) => driver.id);
    }
  }

  getDrivers() {
    this.driverService.getAllDrivers().subscribe((drivers) => {
      this.drivers.set(drivers);
    });
  }
  confirmSyncDriver() {
    const payload = {
      driver_id: this.selectedDriverIds,
    };
    this.dialogRef.close(payload);
  }
  cancelSyncDriver() {
    this.dialogRef.close(null);
  }
}
