import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product';
import { NotificationService } from '../../services/notification.service';
import { ProductFormComponent } from '../../components/product/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);
  
  products = this.productService.getProducts();
  loading = this.productService.isLoading();
  error = this.productService.getError();
  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'stockQuantity', 'actions'];

  ngOnInit() {
    // Recargar productos al inicializar
    this.productService.loadProducts();
  }

  // Abrir diálogo para crear nuevo producto
  openProductForm(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '500px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.addProduct(result);
        // Recargar productos después de crear
        setTimeout(() => this.productService.loadProducts(), 500);
      }
    });
  }

  // Editar producto existente
  editProduct(product: any): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '500px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.updateProduct(product.id, result);
        // Recargar productos después de actualizar
        setTimeout(() => this.productService.loadProducts(), 500);
      }
    });
  }

  // Eliminar producto
  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(id);
      // Recargar productos después de eliminar
      setTimeout(() => this.productService.loadProducts(), 500);
    }
  }
}