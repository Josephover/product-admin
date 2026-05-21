package com.example.demo.service;

import com.example.demo.model.Order;
import com.example.demo.model.OrderStatus;
import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
    
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }
    
    public Optional<Order> getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }
    
    public List<Order> getOrdersByCustomerEmail(String customerEmail) {
        return orderRepository.findByCustomerEmail(customerEmail);
    }
    
    public List<Order> getOrdersByCustomerName(String customerName) {
        return orderRepository.findByCustomerName(customerName);
    }
    
    public Order createOrder(Order order) {
        // Generar número de orden único si no existe
        if (order.getOrderNumber() == null || order.getOrderNumber().isEmpty()) {
            order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        order.setCreatedAt(System.currentTimeMillis());
        order.setUpdatedAt(System.currentTimeMillis());
        order.setStatus(OrderStatus.PENDING); // Estado inicial
        return orderRepository.save(order);
    }
    
    public Order updateOrder(Long id, Order orderDetails) {
        return orderRepository.findById(id).map(order -> {
            order.setCustomerName(orderDetails.getCustomerName());
            order.setCustomerEmail(orderDetails.getCustomerEmail());
            order.setCustomerPhone(orderDetails.getCustomerPhone());
            order.setShippingAddress(orderDetails.getShippingAddress());
            order.setTotalAmount(orderDetails.getTotalAmount());
            order.setStatus(orderDetails.getStatus());
            order.setNotes(orderDetails.getNotes());
            order.setUpdatedAt(System.currentTimeMillis());
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Orden no encontrada"));
    }
    
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
    
    public Order updateOrderStatus(Long id, OrderStatus status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            order.setUpdatedAt(System.currentTimeMillis());
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Orden no encontrada"));
    }
    
    public Order cancelOrder(Long id) {
        return updateOrderStatus(id, OrderStatus.CANCELLED);
    }
    
    public Order shipOrder(Long id) {
        return updateOrderStatus(id, OrderStatus.SHIPPED);
    }
    
    public Order deliverOrder(Long id) {
        return updateOrderStatus(id, OrderStatus.DELIVERED);
    }
}
