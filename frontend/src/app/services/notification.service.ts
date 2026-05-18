import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
    duration: 3000
  };

  // Mostrar mensaje de éxito
  success(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-success']
    });
  }

  // Mostrar mensaje de error
  error(message: string, duration: number = 5000) {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-error']
    });
  }

  // Mostrar mensaje de advertencia
  warning(message: string, duration: number = 4000) {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-warning']
    });
  }

  // Mostrar mensaje de información
  info(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-info']
    });
  }
}
