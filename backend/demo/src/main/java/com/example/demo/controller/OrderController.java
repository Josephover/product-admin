package com.example.demo.controller;

import com.example.demo.model.Order;
import com.example.demo.model.OrderStatus;
import com.example.demo.model.OrderChange;
import com.example.demo.service.OrderService;
import com.example.demo.service.OrderChangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderChangeService orderChangeService;
    
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        logger.info("GET /api/orders - Obteniendo todas las órdenes");
        List<Order> orders = orderService.getAllOrders();
        logger.info("GET /api/orders - Se obtuvieron {} órdenes", orders.size());
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        logger.info("GET /api/orders/{} - Obteniendo orden por ID", id);
        Optional<Order> order = orderService.getOrderById(id);
        if (order.isPresent()) {
            logger.info("GET /api/orders/{} - Orden encontrada: {}", id, order.get().getOrderNumber());
        } else {
            logger.warn("GET /api/orders/{} - Orden NO encontrada", id);
        }
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search/orderNumber")
    public ResponseEntity<Order> getOrderByOrderNumber(@RequestParam String orderNumber) {
        Optional<Order> order = orderService.getOrderByOrderNumber(orderNumber);
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/customer/email")
    public ResponseEntity<List<Order>> getOrdersByCustomerEmail(@RequestParam String email) {
        List<Order> orders = orderService.getOrdersByCustomerEmail(email);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/customer/name")
    public ResponseEntity<List<Order>> getOrdersByCustomerName(@RequestParam String customerName) {
        List<Order> orders = orderService.getOrdersByCustomerName(customerName);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/statuses")
    public ResponseEntity<OrderStatus[]> getAvailableStatuses() {
        return ResponseEntity.ok(OrderStatus.values());
    }
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        logger.info("POST /api/orders - Creando nueva orden para cliente: {}", order.getCustomerName());
        Order newOrder = orderService.createOrder(order);
        logger.info("POST /api/orders - ✅ Orden creada exitosamente: {} (Monto: ${})", newOrder.getOrderNumber(), newOrder.getTotalAmount());
        return ResponseEntity.status(HttpStatus.CREATED).body(newOrder);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        try {
            logger.info("PUT /api/orders/{} - Actualizando orden", id);
            Order updatedOrder = orderService.updateOrder(id, orderDetails);
            logger.info("PUT /api/orders/{} - ✅ Orden actualizada: {}", id, updatedOrder.getOrderNumber());
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            logger.warn("PUT /api/orders/{} - ❌ Error: Orden no encontrada", id);
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        try {
            logger.info("PATCH /api/orders/{}/status - Cambiando estado a: {}", id, status);
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            logger.info("PATCH /api/orders/{}/status - ✅ Estado cambiado a {} para orden: {}", id, status, updatedOrder.getOrderNumber());
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            logger.warn("PATCH /api/orders/{}/status - ❌ Error: Orden no encontrada", id);
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{id}/ship")
    public ResponseEntity<Order> shipOrder(@PathVariable Long id) {
        try {
            Order order = orderService.shipOrder(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{id}/deliver")
    public ResponseEntity<Order> deliverOrder(@PathVariable Long id) {
        try {
            Order order = orderService.deliverOrder(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long id) {
        try {
            Order order = orderService.cancelOrder(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        logger.info("DELETE /api/orders/{} - Eliminando orden", id);
        Optional<Order> order = orderService.getOrderById(id);
        if (order.isPresent()) {
            orderService.deleteOrder(id);
            logger.info("DELETE /api/orders/{} - ✅ Orden eliminada: {}", id, order.get().getOrderNumber());
        } else {
            logger.warn("DELETE /api/orders/{} - ❌ Orden no encontrada", id);
        }
        return ResponseEntity.noContent().build();
    }
    
    // Endpoints para Historial de Cambios
    @GetMapping("/{id}/changes")
    public ResponseEntity<List<OrderChange>> getOrderChanges(@PathVariable Long id) {
        logger.info("GET /api/orders/{}/changes - Obteniendo historial de cambios", id);
        List<OrderChange> changes = orderChangeService.getOrderChanges(id);
        logger.info("GET /api/orders/{}/changes - Se obtuvieron {} cambios", id, changes.size());
        return ResponseEntity.ok(changes);
    }
    
    @GetMapping("/changes/by-number/{orderNumber}")
    public ResponseEntity<List<OrderChange>> getOrderChangesByNumber(@PathVariable String orderNumber) {
        logger.info("GET /api/orders/changes/by-number/{} - Obteniendo historial de cambios", orderNumber);
        List<OrderChange> changes = orderChangeService.getOrderChangesByNumber(orderNumber);
        logger.info("GET /api/orders/changes/by-number/{} - Se obtuvieron {} cambios", orderNumber, changes.size());
        return ResponseEntity.ok(changes);
    }
}
