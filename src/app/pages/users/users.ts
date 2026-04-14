import { Component, viewChild, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DriverService } from '../../services/driver-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Supplier } from '../../models/supplier';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { firstValueFrom } from 'rxjs';
import { SupplierService } from '../../services/supplier-service';
import { FormAddSupplier } from '../form-add-supplier/form-add-supplier';
import { User } from '../../models/user';
import { FormAddUser } from '../form-add-user/form-add-user';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, 
    MatSortModule, MatInputModule, MatFormFieldModule, 
    MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  displayedColumns: string[] = ['userName', 'userEmail', 'userRole', 'userStatus', 'acoes'];
  dataSource = new MatTableDataSource<User>([]);
  paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);
  isLoading = signal(true);
  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator();
    this.dataSource.sort = this.sort();
  }
  getUsers() {
    this.userService.getUsers().subscribe((users) => {
      this.dataSource.data = users;
      this.isLoading.set(false);
    });
  }
  ngOnInit() {
    this.getUsers();
  }
  openAddUserDialog() {
    this.dialog.open(FormAddUser, {
      width: '400px',
    });
  }
  updateUser(user: User) {
    console.log(user);
  }
  deleteUser(user: User) {
    console.log(user);
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
