import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Role } from '../../models/role';
import { UserService } from '../../services/user-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { FormAddRole } from '../../forms/form-add-role/form-add-role';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { RolesServices } from '../../services/roles-services';
import { JoinPipe } from '../../join-pipe';
import { Permission } from '../../models/permission';
@Component({
  selector: 'app-roles',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, 
    MatSortModule, MatInputModule, MatFormFieldModule, 
    MatButtonModule, MatIconModule, MatChipsModule, JoinPipe],
  templateUrl: './roles.html',
  styleUrl: './roles.scss',
})
export class Roles {  
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  totalRegistros = 0;
  pageSize = 5;
  indicePagina = 0; 
  displayedColumns: string[] = ['role', 'permissions', 'acoes'];
  dataSource = new MatTableDataSource<Role>([]);
  private rolesService = inject(RolesServices);
  permissions = signal<Permission[]>([]);
  ngOnInit() {
    this.getRoles();    
  }
  getRoles() {
    this.rolesService.getRoles(this.indicePagina, this.pageSize).subscribe((roles) => {
      this.dataSource.data = roles.data;
      this.totalRegistros = roles.total;
      this.indicePagina = roles.current_page - 1;
      this.pageSize = roles.per_page;
    });
  }
  updateRole(role: Role) {
    const dialogRef = this.dialog.open(FormAddRole, {
      width: '500px',
      data: role,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rolesService.updateRole(role.id, result).subscribe({
          next: (role) => {
            this.snackBar.open('Cargo atualizado com sucesso', 'Fechar', { duration: 3000 });
            this.getRoles();
          },
          error: (error) => {
            console.error('Erro ao atualizar cargo:', error);
            this.snackBar.open('Erro ao atualizar cargo', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
  deleteRole(role: Role) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      data: {
        title: 'Excluir Cargo',
        message: `Tem certeza que deseja excluir o cargo ${role.name}?`,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rolesService.deleteRole(role.id).subscribe({
          next: () => {
          this.snackBar.open('Cargo excluído com sucesso', 'Fechar', { duration: 3000 });
          this.getRoles();
          },
          error: (error) => {
          console.error('Erro ao excluir cargo:', error);
          this.snackBar.open('Erro ao excluir cargo', 'Fechar', { duration: 3000 });
          }
        });
        this.getRoles();
      }
    });
  }
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.indicePagina = event.pageIndex;
    this.getRoles();
  }
  openAddRoleDialog() {
    const dialogRef = this.dialog.open(FormAddRole, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rolesService.createRole(result).subscribe((role) => {
          this.getRoles();
        }, error => {
          console.error('Erro ao criar cargo:', error);
          this.snackBar.open('Erro ao criar cargo', 'Fechar', { duration: 3000 });
        });
      }
    });
  }
  getAllPermissions() {
    this.rolesService.getPermissions().subscribe((permissions) => {
      this.permissions.set(permissions);
    });
  }
}
