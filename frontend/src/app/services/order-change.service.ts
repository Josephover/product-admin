import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderChange } from '../models/order-change.model';

@Injectable({
  providedIn: 'root'
})
export class OrderChangeService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getOrderChanges(orderId: number) {
    return this.http.get<OrderChange[]>(`${this.apiUrl}/${orderId}/changes`);
  }

  getOrderChangesByNumber(orderNumber: string) {
    return this.http.get<OrderChange[]>(`${this.apiUrl}/changes/by-number/${orderNumber}`);
  }
}
