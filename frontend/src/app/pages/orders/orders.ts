import { Component, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../services/order';
import { NotificationService } from '../../services/notification.service';
import { OrderForm } from '../../components/order/order-form';
import { Order, OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    NgbModule
  ],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class Orders implements OnInit {
  searchControl = new FormControl('');
  statusControl = new FormControl('');

  // Expose OrderStatus to template
  OrderStatus = OrderStatus;

  statuses: string[] = [];

  // Use getters to avoid initialization order issues
  get filteredOrders() {
    return this.orderService.filteredOrders;
  }

  get pagedOrders() {
    return this.orderService.pagedOrders;
  }

  get loading() {
    return this.orderService.loading;
  }

  // Pagination
  pageSize = signal(10);
  currentPage = signal(1);
  totalItems = signal(0);
  pageSizeOptions = [5, 10, 25, 50];

  displayedColumns: string[] = ['id', 'orderNumber', 'customerName', 'customerEmail', 'totalAmount', 'status', 'actions'];

  statusNames: { [key in OrderStatus]: string } = {
    [OrderStatus.PENDING]: 'Pendiente',
    [OrderStatus.CONFIRMED]: 'Confirmado',
    [OrderStatus.SHIPPED]: 'Enviado',
    [OrderStatus.DELIVERED]: 'Entregado',
    [OrderStatus.CANCELLED]: 'Cancelado',
    [OrderStatus.RETURNED]: 'Devuelto'
  };

  statusColors: { [key in OrderStatus]: string } = {
    [OrderStatus.PENDING]: 'warning',
    [OrderStatus.CONFIRMED]: 'info',
    [OrderStatus.SHIPPED]: 'primary',
    [OrderStatus.DELIVERED]: 'success',
    [OrderStatus.CANCELLED]: 'danger',
    [OrderStatus.RETURNED]: 'secondary'
  };

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    // Auto-update filtered/paged orders when list changes
    effect(() => {
      const orders = this.orderService.ordersList();
      this.updateFilteredOrders();
      this.totalItems.set(orders.length);
    });
  }

  ngOnInit() {
    this.orderService.loadOrders();
    this.loadStatuses();

    // Listen to search changes
    this.searchControl.valueChanges.subscribe(() => {
      this.currentPage.set(1);
      this.updateFilteredOrders();
    });

    // Listen to status changes
    this.statusControl.valueChanges.subscribe(() => {
      this.currentPage.set(1);
      this.updateFilteredOrders();
    });
  }

  loadStatuses() {
    this.orderService.getAvailableStatuses().subscribe({
      next: (statuses) => {
        this.statuses = statuses;
      }
    });
  }

  updateFilteredOrders() {
    const searchTerm = this.searchControl.value || '';
    const status = this.statusControl.value || '';
    this.orderService.searchAndFilter(searchTerm, status);
    this.updatePagedOrders();
  }

  updatePagedOrders() {
    const filtered = this.orderService.filteredOrders();
    const pageSize = this.pageSize();
    const currentPage = this.currentPage();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    this.orderService.pagedOrders.set(filtered.slice(startIndex, endIndex));
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.updatePagedOrders();
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.updatePagedOrders();
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.statusControl.setValue('');
  }

  openOrderForm() {
    const dialogRef = this.dialog.open(OrderForm, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderService.addOrder(result);
      }
    });
  }

  editOrder(order: Order) {
    const dialogRef = this.dialog.open(OrderForm, {
      width: '500px',
      data: { ...order }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderService.updateOrder(order.id!, result);
      }
    });
  }

  changeStatus(order: Order, newStatus: OrderStatus) {
    this.orderService.updateOrderStatus(order.id!, newStatus);
  }

  deleteOrder(order: Order) {
    if (confirm(`¿Estás seguro de que deseas eliminar la orden ${order.orderNumber}?`)) {
      this.orderService.deleteOrder(order.id!);
    }
  }

  getStatusColor(status: OrderStatus): string {
    return this.statusColors[status];
  }

  getStatusDisplayName(status: OrderStatus): string {
    return this.statusNames[status];
  }

  getStartIndex(): number {
    return (this.currentPage() - 1) * this.pageSize() + 1;
  }

  getEndIndex(): number {
    const end = this.currentPage() * this.pageSize();
    return Math.min(end, this.totalItems());
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems() / this.pageSize());
  }

  getStatusNameFromString(status: string): string {
    return this.statusNames[status as OrderStatus] || status;
  }
}
