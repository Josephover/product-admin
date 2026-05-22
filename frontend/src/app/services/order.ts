import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order, OrderStatus } from '../models/order.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  // Signals
  ordersList = signal<Order[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  filteredOrders = signal<Order[]>([]);
  pagedOrders = signal<Order[]>([]);

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  loadOrders() {
    this.loading.set(true);
    this.http.get<Order[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.ordersList.set(data);
        this.filteredOrders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar órdenes');
        this.loading.set(false);
      }
    });
  }

  getOrderById(id: number) {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getOrderByOrderNumber(orderNumber: string) {
    return this.http.get<Order>(`${this.apiUrl}/search/orderNumber?orderNumber=${orderNumber}`);
  }

  getOrdersByCustomerEmail(email: string) {
    return this.http.get<Order[]>(`${this.apiUrl}/customer/email?email=${email}`);
  }

  getOrdersByCustomerName(customerName: string) {
    return this.http.get<Order[]>(`${this.apiUrl}/customer/name?customerName=${customerName}`);
  }

  getOrdersByStatus(status: OrderStatus) {
    return this.http.get<Order[]>(`${this.apiUrl}/status/${status}`);
  }

  getAvailableStatuses() {
    return this.http.get<OrderStatus[]>(`${this.apiUrl}/statuses`);
  }

  addOrder(order: Order) {
    this.loading.set(true);
    this.http.post<Order>(this.apiUrl, order).subscribe({
      next: (newOrder) => {
        this.ordersList.update(orders => [newOrder, ...orders]);
        this.filteredOrders.update(orders => [newOrder, ...orders]);
        if (newOrder?.orderNumber) {
          this.notificationService.orderCreated(newOrder.orderNumber);
        } else {
          this.notificationService.success('✅ Orden creada exitosamente');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.notificationService.operationFailed('crear la orden');
        this.loading.set(false);
      }
    });
  }

  updateOrder(id: number, order: Order) {
    this.loading.set(true);
    this.http.put<Order>(`${this.apiUrl}/${id}`, order).subscribe({
      next: (updatedOrder) => {
        this.ordersList.update(orders =>
          orders.map(o => o.id === id ? updatedOrder : o)
        );
        this.filteredOrders.update(orders =>
          orders.map(o => o.id === id ? updatedOrder : o)
        );
        if (updatedOrder?.orderNumber) {
          this.notificationService.orderUpdated(updatedOrder.orderNumber);
        } else {
          this.notificationService.success('✏️ Orden actualizada correctamente');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.notificationService.operationFailed('actualizar la orden');
        this.loading.set(false);
      }
    });
  }

  updateOrderStatus(id: number, status: OrderStatus) {
    this.loading.set(true);
    this.http.patch<Order>(`${this.apiUrl}/${id}/status?status=${status}`, {}).subscribe({
      next: (updatedOrder) => {
        this.ordersList.update(orders =>
          orders.map(o => o.id === id ? updatedOrder : o)
        );
        this.filteredOrders.update(orders =>
          orders.map(o => o.id === id ? updatedOrder : o)
        );
        if (updatedOrder?.orderNumber) {
          this.notificationService.statusChanged(updatedOrder.orderNumber, this.getStatusDisplayName(status));
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.notificationService.operationFailed('actualizar el estado');
        this.loading.set(false);
      }
    });
  }

  deleteOrder(id: number) {
    this.loading.set(true);
    // Obtener el número de orden antes de eliminar
    const orderToDelete = this.ordersList().find(o => o.id === id);
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.ordersList.update(orders => orders.filter(o => o.id !== id));
        this.filteredOrders.update(orders => orders.filter(o => o.id !== id));
        if (orderToDelete?.orderNumber) {
          this.notificationService.orderDeleted(orderToDelete.orderNumber);
        } else {
          this.notificationService.success('✅ Orden eliminada exitosamente');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.notificationService.operationFailed('eliminar la orden');
        this.loading.set(false);
      }
    });
  }

  searchAndFilter(searchTerm: string, status: string) {
    const orders = this.ordersList();
    this.filteredOrders.set(
      orders.filter(order => {
        const matchesSearch = !searchTerm ||
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = !status || order.status === status;
        
        return matchesSearch && matchesStatus;
      })
    );
  }

  advancedSearch(
    searchTerm: string,
    status: string,
    orderNumber: string,
    minAmount: number | null,
    maxAmount: number | null
  ) {
    const orders = this.ordersList();
    
    this.filteredOrders.set(
      orders.filter(order => {
        // Búsqueda por texto
        const matchesSearch = !searchTerm ||
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtro por estado
        const matchesStatus = !status || order.status === status;
        
        // Filtro por número de orden
        const matchesOrderNumber = !orderNumber ||
          order.orderNumber?.toLowerCase().includes(orderNumber.toLowerCase());
        
        // Filtro por monto (rango)
        let matchesAmount = true;
        if (minAmount !== null && order.totalAmount < minAmount) matchesAmount = false;
        if (maxAmount !== null && order.totalAmount > maxAmount) matchesAmount = false;
        
        return matchesSearch && matchesStatus && matchesOrderNumber && matchesAmount;
      })
    );
  }

  getStatusDisplayName(status: OrderStatus): string {
    const statusNames: { [key in OrderStatus]: string } = {
      [OrderStatus.PENDING]: 'Pendiente',
      [OrderStatus.CONFIRMED]: 'Confirmado',
      [OrderStatus.SHIPPED]: 'Enviado',
      [OrderStatus.DELIVERED]: 'Entregado',
      [OrderStatus.CANCELLED]: 'Cancelado',
      [OrderStatus.RETURNED]: 'Devuelto'
    };
    return statusNames[status] || status;
  }
}
