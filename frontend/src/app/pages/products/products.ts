import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product';
import { NotificationService } from '../../services/notification.service';
import { ProductFormComponent } from '../../components/product/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
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
  
  // Búsqueda y filtrado con FormControl
  searchControl = new FormControl('');
  categoryControl = new FormControl<string | null>(null);
  categories = signal<string[]>([]);
  filteredProducts = signal<any[]>([]);
  
  // Effect para actualizar productos filtrados cuando cambian
  private updateEffect = effect(() => {
    const _ = this.products();
    this.updateFilteredProducts();
  });

  ngOnInit() {
    // Recargar productos al inicializar
    this.productService.loadProducts();
    
    // Cargar categorías
    this.productService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
    
    // Observar cambios en búsqueda
    this.searchControl.valueChanges.subscribe(() => {
      this.updateFilteredProducts();
    });
    
    // Observar cambios en categoría
    this.categoryControl.valueChanges.subscribe(() => {
      this.updateFilteredProducts();
    });
  }

  // Actualizar productos filtrados
  updateFilteredProducts(): void {
    const search = this.searchControl.value || '';
    const category = this.categoryControl.value;
    this.filteredProducts.set(
      this.productService.searchAndFilter(search, category)
    );
  }

  // Limpiar filtros
  clearFilters(): void {
    this.searchControl.reset('');
    this.categoryControl.reset(null);
    this.updateFilteredProducts();
  }
  
  // Verificar si hay filtros activos
  hasActiveFilters(): boolean {
    return !!(this.searchControl.value || this.categoryControl.value);
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