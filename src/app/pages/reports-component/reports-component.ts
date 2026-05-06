import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReportCard, reportCards } from '../../models/report-card';
import { Router } from '@angular/router';
import { FilterReportComponent } from '../../components/filter-report-component/filter-report-component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reports-component',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatGridListModule],
  templateUrl: './reports-component.html',
  styleUrl: './reports-component.scss',
})
export class ReportsComponent {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  reportCards = reportCards;
  filteredCards = computed(() => this.reportCards.filter(card => card.category === 'Combustível'));
  
  filtrarPorCategoria(categoria: string) {
    return this.reportCards.filter(card => card.category === categoria);
  }
  navegar(route: string) {
    // this.router.navigate([route]);
  }

  openFilterReport(reportCard: ReportCard) {
    const dialogRef = this.dialog.open(FilterReportComponent, {
      data: reportCard,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result, 'result');
      if (result) {
        this.router.navigate(['/report/preview', reportCard.id], { queryParams: result });
      }
    });
  }
}
