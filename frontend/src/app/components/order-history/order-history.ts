import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderChange, ChangeTypeDisplayNames, ChangeTypeIcons, ChangeTypeColors } from '../../models/order-change.model';
import { OrderChangeService } from '../../services/order-change.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.scss']
})
export class OrderHistoryComponent implements OnInit {
  changes: OrderChange[] = [];
  loading = true;
  error: string | null = null;

  ChangeTypeDisplayNames = ChangeTypeDisplayNames;
  ChangeTypeIcons = ChangeTypeIcons;
  ChangeTypeColors = ChangeTypeColors;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { orderId: number; orderNumber: string },
    private orderChangeService: OrderChangeService
  ) {}

  ngOnInit() {
    this.loadChanges();
  }

  loadChanges() {
    this.loading = true;
    this.orderChangeService.getOrderChanges(this.data.orderId).subscribe({
      next: (changes) => {
        this.changes = changes;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el historial';
        this.loading = false;
      }
    });
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES');
  }

  getColorClass(colorType: string): string {
    return `change-${colorType}`;
  }
}
