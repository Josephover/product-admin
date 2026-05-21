import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Order, OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './order-form.html',
  styleUrls: ['./order-form.scss']
})
export class OrderForm implements OnInit {
  orderForm: FormGroup;
  orderStatuses = Object.values(OrderStatus);
  isEdit = false;

  statusNames: { [key in OrderStatus]: string } = {
    [OrderStatus.PENDING]: 'Pendiente',
    [OrderStatus.CONFIRMED]: 'Confirmado',
    [OrderStatus.SHIPPED]: 'Enviado',
    [OrderStatus.DELIVERED]: 'Entregado',
    [OrderStatus.CANCELLED]: 'Cancelado',
    [OrderStatus.RETURNED]: 'Devuelto'
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrderForm>,
    @Inject(MAT_DIALOG_DATA) public data: Order
  ) {
    this.orderForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: [''],
      shippingAddress: ['', Validators.required],
      totalAmount: ['', [Validators.required, Validators.min(0)]],
      status: [OrderStatus.PENDING],
      notes: ['']
    });

    this.isEdit = !!data && !!data.id;
  }

  ngOnInit() {
    if (this.isEdit && this.data) {
      this.orderForm.patchValue(this.data);
    }
  }

  save() {
    if (this.orderForm.valid) {
      this.dialogRef.close(this.orderForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  hasError(controlName: string): boolean {
    const field = this.orderForm.get(controlName);
    return !!(field && field.invalid && field.touched);
  }
}
