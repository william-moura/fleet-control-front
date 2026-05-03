import { Component, viewChild, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { FormAddSupplier } from '../../forms/form-add-supplier/form-add-supplier';
import { User } from '../../models/user';
import { FormAddUser } from '../../forms/form-add-user/form-add-user';
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
  displayedColumns: string[] = ['name', 'email', 'role', 'acoes'];
  dataSource = new MatTableDataSource<User>([]);
  paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);
  isLoading = signal(true);
  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  totalRegistros = 0;
  pageSize = 5;
  indicePagina = 0;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort();
  }
  getUsers() {
    this.userService.getUsers(0, 10000).subscribe((pagination) => {
      this.dataSource.data = pagination.data;
      this.totalRegistros = pagination.total;
      this.isLoading.set(false);
    });
  }
  ngOnInit() {
    this.getUsers();
  }
  openAddUserDialog() {
    const dialogRef = this.dialog.open(FormAddUser, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.createUser(result).subscribe({
          next: (user) => {
            this.snackBar.open('Usuário cadastrado com sucesso', 'Fechar', { duration: 3000 });
            this.getUsers();
          },
          error: (error) => {
            console.error('Erro ao cadastrar usuário:', error);
            this.snackBar.open('Erro ao cadastrar usuário', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
  updateUser(user: User) {
    const dialogRef = this.dialog.open(FormAddUser, {
      width: '500px',
      data: user,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(user.id, result).subscribe({
          next: () => {
            this.snackBar.open('Usuário atualizado com sucesso', 'Fechar', { duration: 3000 });
            this.getUsers();
          },
          error: (error) => {
            console.error('Erro ao atualizar usuário:', error);
            this.snackBar.open('Erro ao atualizar usuário', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      data: {
        title: 'Excluir Usuário',
        message: 'Tem certeza que deseja excluir o usuário?',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.snackBar.open('Usuário excluído com sucesso', 'Fechar', { duration: 3000 });
            this.getUsers();
          },
          error: (error) => {
          console.error('Erro ao excluir usuário:', error);
          this.snackBar.open('Erro ao excluir usuário', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onPageChange(event: PageEvent) {
    this.indicePagina = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getUsers();
  }
}
