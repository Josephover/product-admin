import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/products';
  
  // Usaremos Signals (lo más nuevo de Angular) para el estado
  private productsList = signal<Product[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  constructor() {
    this.loadProducts();
  }

  // Cargar productos desde el backend
  loadProducts() {
    this.loading.set(true);
    this.error.set(null);
    
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (products) => {
        this.productsList.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar productos');
        console.error('Error:', err);
        this.loading.set(false);
      }
    });
  }

  // Método para obtener los productos (señal de solo lectura)
  getProducts() {
    return this.productsList.asReadonly();
  }

  // Obtener estado de carga
  isLoading() {
    return this.loading.asReadonly();
  }

  // Obtener errores
  getError() {
    return this.error.asReadonly();
  }

  // Método para obtener producto por ID
  getProductById(id: number) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Método para crear un producto
  addProduct(product: Product) {
    this.http.post<Product>(this.apiUrl, product).subscribe({
      next: (newProduct) => {
        this.productsList.update(prods => [...prods, newProduct]);
      },
      error: (err) => {
        this.error.set('Error al crear producto');
        console.error('Error:', err);
      }
    });
  }

  // Método para actualizar un producto existente
  updateProduct(id: number, updatedProduct: Partial<Product>) {
    this.http.put<Product>(`${this.apiUrl}/${id}`, updatedProduct).subscribe({
      next: (product) => {
        this.productsList.update(prods =>
          prods.map(prod => prod.id === id ? product : prod)
        );
      },
      error: (err) => {
        this.error.set('Error al actualizar producto');
        console.error('Error:', err);
      }
    });
  }

  // Método para eliminar un producto
  deleteProduct(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.productsList.update(prods => prods.filter(prod => prod.id !== id));
      },
      error: (err) => {
        this.error.set('Error al eliminar producto');
        console.error('Error:', err);
      }
    });
  }

  // Método para buscar productos
  searchProducts(name: string) {
    return this.http.get<Product[]>(`${this.apiUrl}/search?name=${name}`);
  }

  // Método para obtener productos por categoría
  getProductsByCategory(category: string) {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
  }

  // Método para desactivar un producto
  deactivateProduct(id: number) {
    return this.http.patch(`${this.apiUrl}/${id}/deactivate`, {});
  }
}