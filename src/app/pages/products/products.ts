import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products {
  // Inyectamos el servicio
  private productService = inject(ProductService);
  
  // Obtenemos la señal de productos del servicio
  products = this.productService.getProducts();

  // Definimos las columnas que queremos mostrar
  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'stock', 'actions'];
}