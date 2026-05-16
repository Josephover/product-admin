import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product';
import { ProductFormComponent } from '../../components/product/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  
  products = this.productService.getProducts();
  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'stock', 'actions'];

  // Abrir diálogo para crear nuevo producto
  openProductForm(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '500px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.addProduct(result);
        // Recargar productos
        this.products = this.productService.getProducts();
      }
    });
  }

  // Editar producto existente
  editProduct(product: any): void {
    console.log('Abriendo diálogo de edición con producto:', product);
    
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '500px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Diálogo cerrado con resultado:', result);
      if (result) {
        this.productService.updateProduct(product.id, result);
        this.products = this.productService.getProducts();
      }
    });
  }

  // Eliminar producto
  deleteProduct(id: number): void {
    this.productService.deleteProduct(id);
    this.products = this.productService.getProducts();
  }
}