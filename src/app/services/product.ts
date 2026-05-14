import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Usaremos Signals (lo más nuevo de Angular) para el estado
  private productsList = signal<Product[]>([
    { id: 1, name: 'Laptop Pro', description: 'Para desarrolladores', price: 1200, stock: 10, category: 'Tech' },
    { id: 2, name: 'Mouse Optico', description: 'Ergonómico', price: 25, stock: 50, category: 'Accesorios' }
  ]);

  constructor() {}

  // Método para obtener los productos (señal de solo lectura)
  getProducts() {
    return this.productsList.asReadonly();
  }

  // Método para añadir (luego lo conectaremos al formulario)
  addProduct(product: Product) {
    this.productsList.update(prods => [...prods, product]);
  }
}