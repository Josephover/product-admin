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
    duration: 4000
  };

  // Reproducir sonido según el tipo
  private playSound(type: 'success' | 'error' | 'info' | 'warning') {
    try {
      const audioContext = new (window as any).AudioContext || new (window as any).webkitAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      switch (type) {
        case 'success':
          oscillator.frequency.value = 800;
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case 'error':
          oscillator.frequency.value = 400;
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case 'info':
          oscillator.frequency.value = 600;
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.15);
          break;
        case 'warning':
          oscillator.frequency.value = 500;
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
      }
    } catch (e) {
      // Si no hay soporte de Audio, simplemente continuar
    }
  }

  // Mostrar mensaje de éxito
  success(message: string, duration: number = 4000, playSound: boolean = true) {
    if (playSound) this.playSound('success');
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  // Mostrar mensaje de error
  error(message: string, duration: number = 5000, playSound: boolean = true) {
    if (playSound) this.playSound('error');
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  // Mostrar mensaje de advertencia
  warning(message: string, duration: number = 4000, playSound: boolean = true) {
    if (playSound) this.playSound('warning');
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-warning'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  // Mostrar mensaje de información
  info(message: string, duration: number = 3000, playSound: boolean = true) {
    if (playSound) this.playSound('info');
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-info'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  // Métodos específicos para órdenes
  orderCreated(orderNumber: string) {
    this.success(`✅ Orden ${orderNumber} creada exitosamente`, 4000);
  }

  orderUpdated(orderNumber: string) {
    this.success(`✏️ Orden ${orderNumber} actualizada correctamente`, 4000);
  }

  orderDeleted(orderNumber: string) {
    this.success(`🗑️ Orden ${orderNumber} eliminada exitosamente`, 4000);
  }

  statusChanged(orderNumber: string, newStatus: string) {
    this.success(`📊 Estado de ${orderNumber} cambió a: ${newStatus}`, 4000);
  }

  orderNotFound() {
    this.warning('⚠️ No se encontró la orden', 4000);
  }

  operationFailed(operation: string) {
    this.error(`❌ Error al ${operation}. Por favor, intenta de nuevo.`, 5000);
  }

  validationError(message: string) {
    this.error(`⚠️ ${message}`, 4000);
  }
}
