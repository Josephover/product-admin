package com.example.demo.controller;

import com.example.demo.model.Order;
import com.example.demo.model.OrderStatus;
import com.example.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
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
        Order newOrder = orderService.createOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(newOrder);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        try {
            Order updatedOrder = orderService.updateOrder(id, orderDetails);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
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
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
