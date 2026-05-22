import { Injectable } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private statusDisplayNames: { [key in OrderStatus]: string } = {
    [OrderStatus.PENDING]: 'Pendiente',
    [OrderStatus.CONFIRMED]: 'Confirmado',
    [OrderStatus.SHIPPED]: 'Enviado',
    [OrderStatus.DELIVERED]: 'Entregado',
    [OrderStatus.CANCELLED]: 'Cancelado',
    [OrderStatus.RETURNED]: 'Devuelto'
  };

  exportToCSV(orders: Order[], filename: string = 'ordenes'): void {
    if (!orders || orders.length === 0) {
      console.warn('No hay órdenes para exportar');
      return;
    }

    // Preparar encabezados
    const headers = ['ID', 'Nº Orden', 'Cliente', 'Email', 'Teléfono', 'Dirección', 'Monto', 'Estado', 'Fecha'];

    // Preparar datos
    const data = orders.map(order => [
      order.id || '',
      order.orderNumber || '',
      order.customerName || '',
      order.customerEmail || '',
      order.customerPhone || '',
      order.shippingAddress || '',
      order.totalAmount.toFixed(2),
      this.statusDisplayNames[order.status] || order.status,
      order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-ES') : ''
    ]);

    // Crear contenido CSV
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => {
        // Escapar comillas y envolver en comillas si contiene comas
        const escapedCell = String(cell).replace(/"/g, '""');
        return `"${escapedCell}"`;
      }).join(','))
    ].join('\n');

    // Crear Blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToPDF(orders: Order[], filename: string = 'ordenes'): void {
    if (!orders || orders.length === 0) {
      console.warn('No hay órdenes para exportar');
      return;
    }

    // Crear documento PDF
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Agregar título
    doc.setFontSize(16);
    doc.text('Reporte de Órdenes', 14, 15);

    // Agregar fecha de generación
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`, 14, 22);
    doc.setTextColor(0);

    // Preparar datos para la tabla
    const headers = ['ID', 'Nº Orden', 'Cliente', 'Email', 'Teléfono', 'Monto', 'Estado', 'Fecha'];
    const data = orders.map(order => [
      String(order.id || ''),
      order.orderNumber || '',
      order.customerName || '',
      order.customerEmail || '',
      order.customerPhone || '',
      `$${order.totalAmount.toFixed(2)}`,
      this.statusDisplayNames[order.status] || order.status,
      order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-ES') : ''
    ]);

    // Agregar tabla
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 28,
      theme: 'grid',
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: 50
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      didDrawPage: (data: any) => {
        // Pie de página con número de página
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.getHeight();
        const pageWidth = pageSize.getWidth();
        const totalPages = doc.getNumberOfPages();

        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Página ${data.pageNumber} de ${totalPages}`,
          pageWidth / 2,
          pageHeight - 5,
          { align: 'center' }
        );
      }
    });

    // Descargar PDF
    doc.save(`${filename}-${new Date().getTime()}.pdf`);
  }
}
