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
      description: [''],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      isActive: [true]
    });
  }

  ngAfterViewInit(): void {
    // Aquí es donde precargamos los datos si existen
    setTimeout(() => {
      if (this.dialogData) {
        console.log('Datos a precargar:', this.dialogData);
        this.productForm.patchValue({
          name: this.dialogData.name || '',
          description: this.dialogData.description || '',
          category: this.dialogData.category || '',
          price: this.dialogData.price || 0,
          stockQuantity: this.dialogData.stockQuantity || this.dialogData.stock || 0,
          imageUrl: this.dialogData.imageUrl || '',
          isActive: this.dialogData.isActive !== undefined ? this.dialogData.isActive : true
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
