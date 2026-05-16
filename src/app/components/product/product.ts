import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './product.html',
})
export class ProductFormComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProductFormComponent>);
  dialogData = inject(MAT_DIALOG_DATA, { optional: true });

  productForm: FormGroup;

  constructor() {
    // Crear el formulario en el constructor con valores por defecto
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  ngAfterViewInit(): void {
    // Aquí es donde precargamos los datos si existen
    setTimeout(() => {
      if (this.dialogData) {
        console.log('Datos a precargar:', this.dialogData);
        this.productForm.patchValue({
          name: this.dialogData.name || '',
          category: this.dialogData.category || '',
          price: this.dialogData.price || 0,
          stock: this.dialogData.stock || 0,
          description: this.dialogData.description || ''
        });
        console.log('Formulario actualizado:', this.productForm.value);
      }
    }, 0);
  }

  save() {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
